ALLOWED_LANGUAGES = {"en", "so"}
ALLOWED_DOMAINS = {"services", "education", "jobs", "scholarships", "community", "cv-help"}
MAX_MESSAGE_LENGTH = 1000


def validate_ask(data: dict) -> list[str]:
    """Return a list of validation error strings, empty if valid."""
    errors = []

    message = data.get("message")
    if message is None:
        errors.append("message is required")
    elif not isinstance(message, str) or not message.strip():
        errors.append("message must be a non-empty string")
    elif len(message) > MAX_MESSAGE_LENGTH:
        errors.append(f"message must not exceed {MAX_MESSAGE_LENGTH} characters")

    language = data.get("language")
    if language is not None and language not in ALLOWED_LANGUAGES:
        errors.append(f"language must be one of: {', '.join(sorted(ALLOWED_LANGUAGES))}")

    domain = data.get("domain")
    if domain is not None and domain not in ALLOWED_DOMAINS:
        errors.append(f"domain must be one of: {', '.join(sorted(ALLOWED_DOMAINS))}")

    return errors


def validate_voice(files: dict, form: dict) -> list[str]:
    """Return a list of validation error strings, empty if valid."""
    errors = []

    if "audio" not in files:
        errors.append("audio file is required")

    language = form.get("language")
    if language is not None and language not in ALLOWED_LANGUAGES:
        errors.append(f"language must be one of: {', '.join(sorted(ALLOWED_LANGUAGES))}")

    return errors
