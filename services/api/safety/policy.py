"""
Deterministic safety policy for Maktab AI.

Checks whether a message falls into a high-stakes category that the product
contract explicitly prohibits Maktab from answering (docs/privacy.md, T0.5,
T5.2).

Decision values:
  ALLOW  — proceed normally
  REFER  — return a structured referral; do not answer

This is intentionally simple and keyword-based so it is auditable and
testable without an LLM. It will produce false positives on edge cases;
that is acceptable for v1 — better to over-refer than to give a wrong
immigration or medical answer.
"""

from dataclasses import dataclass
from typing import Literal

Decision = Literal["ALLOW", "REFER"]

# ---------------------------------------------------------------------------
# Referral messages — plain language, no invented org names or numbers
# ---------------------------------------------------------------------------

_MESSAGES = {
    "immigration": (
        "Maktab AI cannot predict immigration or asylum outcomes. "
        "Please speak with a qualified immigration lawyer or a registered "
        "legal advice service in your area."
    ),
    "medical": (
        "Maktab AI cannot diagnose medical conditions or advise on medical "
        "treatment. Please contact a qualified healthcare professional or "
        "your local health service."
    ),
    "child_protection": (
        "Maktab AI cannot handle child safety emergencies. "
        "Please contact your local child protection services or emergency "
        "services immediately."
    ),
}

# ---------------------------------------------------------------------------
# Keyword lists — lowercase, checked against the normalised message
# ---------------------------------------------------------------------------

_IMMIGRATION_PHRASES = [
    "will i get asylum",
    "will i be deported",
    "can i win my asylum",
    "will my asylum",
    "asylum case",
    "asylum application",
    "will i be approved",
    "will i get refugee",
    "deportation",
    "will they deport",
    "immigration outcome",
    "immigration decision",
    "will i get leave to remain",
    "will i get status",
    "refugee status decision",
    "will i pass immigration",
]

_MEDICAL_PHRASES = [
    "what disease do i have",
    "do i have",
    "diagnose me",
    "what is wrong with me",
    "should i take this medicine",
    "should i take this medication",
    "what medicine should i take",
    "what medication should i take",
    "what drug should i take",
    "is this medicine safe",
    "medical diagnosis",
    "what illness do i have",
    "what condition do i have",
    "am i sick",
    "do i have cancer",
    "do i have diabetes",
    "do i have hiv",
    "do i have malaria",
    "do i have tuberculosis",
    "do i have tb",
]

_CHILD_PROTECTION_PHRASES = [
    "child is in danger",
    "child is being abused",
    "child abuse",
    "child is hurt",
    "my child is being hurt",
    "child is missing",
    "child protection",
    "child is unsafe",
    "someone is hurting my child",
    "child is being harmed",
]


@dataclass
class PolicyResult:
    decision: Decision
    reason: str | None  # category name, None when ALLOW
    message: str | None  # referral message, None when ALLOW


_ALLOW = PolicyResult(decision="ALLOW", reason=None, message=None)


def check(message: str) -> PolicyResult:
    """
    Return a PolicyResult for the given user message.

    The check is case-insensitive and looks for known high-stakes phrases.
    It does not call any external service or LLM.
    """
    normalised = message.lower().strip()

    for phrase in _IMMIGRATION_PHRASES:
        if phrase in normalised:
            return PolicyResult(
                decision="REFER",
                reason="immigration",
                message=_MESSAGES["immigration"],
            )

    for phrase in _MEDICAL_PHRASES:
        if phrase in normalised:
            return PolicyResult(
                decision="REFER",
                reason="medical",
                message=_MESSAGES["medical"],
            )

    for phrase in _CHILD_PROTECTION_PHRASES:
        if phrase in normalised:
            return PolicyResult(
                decision="REFER",
                reason="child_protection",
                message=_MESSAGES["child_protection"],
            )

    return _ALLOW
