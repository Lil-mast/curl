"""
Transparency helper (T5.1, docs/privacy.md).

Returns the once-per-session disclaimer in the requested language.
The orchestration layer decides *when* to include it (first turn of a
session). This module only owns the text.

Supported languages: en, so
Falls back to English for any unrecognised language code.
"""

_DISCLAIMER = {
    "en": (
        "I am Maktab AI, an AI assistant. "
        "I am not a government service, a legal authority, or a clinic. "
        "The information I provide is for guidance only — please confirm "
        "important details directly with the relevant organisation or professional."
    ),
    "so": (
        "Waxaan ahay Maktab AI, caawiye xisaabeed. "
        "Kuma aha adeeg dowladeed, awood sharci, ama isbitaal. "
        "Macluumaadka aan bixiyo waa tilmaan kaliya — fadlan xaqiiji "
        "macluumaadka muhiimka ah si toos ah ururka ama xirfadlaha ku habboon."
    ),
}


def get_disclaimer(language: str = "en") -> str:
    """Return the session-opening disclaimer in the given language."""
    return _DISCLAIMER.get(language, _DISCLAIMER["en"])
