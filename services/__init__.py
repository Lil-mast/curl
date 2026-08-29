"""Maktab backend packages."""

from __future__ import annotations

import sys
from importlib import import_module

audio_store = import_module("services.api.services.audio_store")
adapters = import_module("services.api.services.adapters")
knowledge = import_module("services.api.services.adapters.knowledge")
voice = import_module("services.api.services.adapters.voice")
safety = import_module("services.api.safety")

sys.modules[__name__ + ".audio_store"] = audio_store
sys.modules[__name__ + ".adapters"] = adapters
sys.modules[__name__ + ".adapters.knowledge"] = knowledge
sys.modules[__name__ + ".adapters.voice"] = voice
sys.modules["safety"] = safety

orchestrator = import_module("services.api.services.orchestrator")
sys.modules[__name__ + ".orchestrator"] = orchestrator

__all__ = ["audio_store", "adapters", "knowledge", "voice", "safety", "orchestrator"]
