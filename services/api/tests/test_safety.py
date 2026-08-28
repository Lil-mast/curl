import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app
from safety.policy import check as safety_check
from safety.transparency import get_disclaimer
from safety import session as session_module


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def clear_session_store():
    """Reset in-memory session store between tests."""
    session_module._store.clear()
    yield
    session_module._store.clear()


# ---------------------------------------------------------------------------
# Safety policy — ALLOW
# ---------------------------------------------------------------------------

def test_allow_education_question():
    result = safety_check("Where can I find English classes nearby?")
    assert result.decision == "ALLOW"
    assert result.reason is None


def test_allow_job_question():
    result = safety_check("What jobs are available for someone without experience?")
    assert result.decision == "ALLOW"


def test_allow_scholarship_question():
    result = safety_check("Are there scholarships for adult learners?")
    assert result.decision == "ALLOW"


def test_allow_services_question():
    result = safety_check("Where can I get help with housing?")
    assert result.decision == "ALLOW"


def test_allow_somali_general_question():
    result = safety_check("Waxaan rabaa inaan helo shaqo nadiifin ah")
    assert result.decision == "ALLOW"


# ---------------------------------------------------------------------------
# Safety policy — REFER: immigration
# ---------------------------------------------------------------------------

def test_refer_asylum_outcome():
    result = safety_check("Will I get asylum?")
    assert result.decision == "REFER"
    assert result.reason == "immigration"
    assert result.message is not None


def test_refer_deportation():
    result = safety_check("Will I be deported?")
    assert result.decision == "REFER"
    assert result.reason == "immigration"


def test_refer_asylum_case():
    result = safety_check("Can I win my asylum case?")
    assert result.decision == "REFER"
    assert result.reason == "immigration"


def test_refer_immigration_case_insensitive():
    result = safety_check("WILL I BE DEPORTED from this country?")
    assert result.decision == "REFER"
    assert result.reason == "immigration"


# ---------------------------------------------------------------------------
# Safety policy — REFER: medical
# ---------------------------------------------------------------------------

def test_refer_medical_diagnosis():
    result = safety_check("What disease do I have?")
    assert result.decision == "REFER"
    assert result.reason == "medical"
    assert result.message is not None


def test_refer_medical_treatment():
    result = safety_check("Should I take this medicine?")
    assert result.decision == "REFER"
    assert result.reason == "medical"


def test_refer_diagnose_me():
    result = safety_check("Can you diagnose me based on my symptoms?")
    assert result.decision == "REFER"
    assert result.reason == "medical"


def test_refer_medication_advice():
    result = safety_check("What medication should I take for my headache?")
    assert result.decision == "REFER"
    assert result.reason == "medical"


# ---------------------------------------------------------------------------
# Safety policy — REFER: child protection
# ---------------------------------------------------------------------------

def test_refer_child_danger():
    result = safety_check("My child is in danger right now")
    assert result.decision == "REFER"
    assert result.reason == "child_protection"
    assert result.message is not None


def test_refer_child_abuse():
    result = safety_check("I think there is child abuse happening")
    assert result.decision == "REFER"
    assert result.reason == "child_protection"


def test_refer_child_protection_keyword():
    result = safety_check("Who handles child protection in this area?")
    assert result.decision == "REFER"
    assert result.reason == "child_protection"


# ---------------------------------------------------------------------------
# Referral messages — no invented orgs or numbers
# ---------------------------------------------------------------------------

def test_referral_message_no_phone_numbers():
    from safety.policy import _MESSAGES
    for msg in _MESSAGES.values():
        # Should not contain digit sequences that look like phone numbers
        import re
        assert not re.search(r"\b\d{3,}\b", msg), (
            f"Referral message contains numbers (possible phone/org number): {msg}"
        )


def test_referral_message_not_empty():
    from safety.policy import _MESSAGES
    for category, msg in _MESSAGES.items():
        assert msg.strip(), f"Referral message for '{category}' is empty"


# ---------------------------------------------------------------------------
# Transparency disclaimer
# ---------------------------------------------------------------------------

def test_disclaimer_english():
    text = get_disclaimer("en")
    assert "Maktab AI" in text
    assert len(text) > 20


def test_disclaimer_somali():
    text = get_disclaimer("so")
    assert "Maktab AI" in text
    assert len(text) > 20


def test_disclaimer_fallback_to_english():
    text = get_disclaimer("fr")
    assert text == get_disclaimer("en")


def test_disclaimer_shown_once_per_session():
    """First turn includes disclaimer; second turn does not."""
    state = session_module.get_or_create(None)
    assert not state.disclaimer_shown
    session_module.mark_disclaimer_shown(state.session_id)
    assert session_module._store[state.session_id].disclaimer_shown is True


# ---------------------------------------------------------------------------
# Session policy
# ---------------------------------------------------------------------------

def test_session_id_is_opaque_uuid():
    import re
    state = session_module.get_or_create(None)
    assert re.match(
        r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        state.session_id,
    )


def test_session_no_user_profile():
    state = session_module.get_or_create(None)
    assert not hasattr(state, "user_id")
    assert not hasattr(state, "name")
    assert not hasattr(state, "transcript")
    assert not hasattr(state, "audio")
    assert not hasattr(state, "cv_draft")
    assert not hasattr(state, "documents")


def test_session_turn_counter():
    state = session_module.get_or_create(None)
    assert state.turn_count == 0
    session_module.record_turn(state.session_id)
    session_module.record_turn(state.session_id)
    assert session_module._store[state.session_id].turn_count == 2


def test_session_continuity_with_known_id():
    state = session_module.get_or_create(None)
    sid = state.session_id
    session_module.record_turn(sid)
    retrieved = session_module.get_or_create(sid)
    assert retrieved.session_id == sid
    assert retrieved.turn_count == 1


def test_session_unknown_id_creates_new():
    state = session_module.get_or_create("nonexistent-id-xyz")
    # A new session is created; the unknown ID is used as-is
    assert state.session_id == "nonexistent-id-xyz"


# ---------------------------------------------------------------------------
# API integration — safety check in /api/ask
# ---------------------------------------------------------------------------

def test_api_ask_normal_question_allowed(client):
    r = client.post("/api/ask", json={"message": "Where can I find a job?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert "referred" not in body or body.get("referred") is not True


def test_api_ask_asylum_question_referred(client):
    r = client.post("/api/ask", json={"message": "Will I get asylum?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["referred"] is True
    assert body["reason"] == "immigration"
    assert body["message"] is not None
    assert "_stub" not in body


def test_api_ask_medical_question_referred(client):
    r = client.post("/api/ask", json={"message": "What disease do I have?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["referred"] is True
    assert body["reason"] == "medical"


def test_api_ask_child_protection_referred(client):
    r = client.post("/api/ask", json={"message": "My child is in danger", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["referred"] is True
    assert body["reason"] == "child_protection"


def test_api_ask_disclaimer_on_first_turn(client):
    r = client.post("/api/ask", json={"message": "Where can I find education support?"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["disclaimer"] is not None
    assert "Maktab AI" in body["disclaimer"]


def test_api_ask_disclaimer_not_on_second_turn(client):
    r1 = client.post("/api/ask", json={"message": "Where can I find education support?"})
    sid = r1.get_json()["session_id"]

    r2 = client.post("/api/ask", json={"message": "Tell me more", "session_id": sid})
    assert r2.get_json()["disclaimer"] is None


def test_api_ask_session_id_returned(client):
    r = client.post("/api/ask", json={"message": "Hello"})
    body = r.get_json()
    assert "session_id" in body
    assert body["session_id"] is not None


def test_api_ask_referred_response_has_no_stub_key(client):
    r = client.post("/api/ask", json={"message": "Will I be deported?"})
    body = r.get_json()
    assert "_stub" not in body
