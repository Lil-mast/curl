#!/usr/bin/env python3
"""
services/voice/test_voice.py
============================
Quick smoke test for the voice service.

Run this BEFORE handing off to Alvine. It tests:
  1. TTS → Somali text → MP3 file
  2. TTS → English text → MP3 file
  3. STT → reads back an MP3 file → text + detected language

Usage:
    python services/voice/test_voice.py

Requirements:
  - .env file with ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID_SO, ELEVENLABS_VOICE_ID_EN
  - pip install -r requirements.txt
"""

import os
import sys

# Load .env before importing our modules
from dotenv import load_dotenv
load_dotenv()

# Add project root to path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from services.voice import speech_to_text, text_to_speech
from services.voice.errors import VoiceServiceError

# Test sentences
SOMALI_TEXT = "Maktab AI waxay ku caawisaa dadka baahan macluumaadka muhiimka ah."
ENGLISH_TEXT = "Maktab AI helps people find the information they need, in the language they speak."

OUTPUT_DIR = os.path.dirname(__file__)


def test_tts_somali():
    print("\n[1/3] TTS — Somali text → MP3")
    try:
        audio = text_to_speech(SOMALI_TEXT, language="so")
        path = os.path.join(OUTPUT_DIR, "test_somali.mp3")
        with open(path, "wb") as f:
            f.write(audio)
        print(f"  ✅ Success — {len(audio):,} bytes → {path}")
        print(f"     Text: \"{SOMALI_TEXT}\"")
        return path
    except VoiceServiceError as e:
        print(f"  ❌ FAILED: {e}")
        return None


def test_tts_english():
    print("\n[2/3] TTS — English text → MP3")
    try:
        audio = text_to_speech(ENGLISH_TEXT, language="en")
        path = os.path.join(OUTPUT_DIR, "test_english.mp3")
        with open(path, "wb") as f:
            f.write(audio)
        print(f"  ✅ Success — {len(audio):,} bytes → {path}")
        print(f"     Text: \"{ENGLISH_TEXT}\"")
        return path
    except VoiceServiceError as e:
        print(f"  ❌ FAILED: {e}")
        return None


def test_stt(audio_path: str, expected_lang: str):
    print(f"\n[3/3] STT — {audio_path} → text")
    if not audio_path or not os.path.exists(audio_path):
        print("  ⚠️  Skipped — no audio file to transcribe (TTS test failed).")
        return

    try:
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()

        result = speech_to_text(audio_bytes, language_hint=expected_lang)
        print(f"  ✅ Success")
        print(f"     Detected language : {result['detected_language']}")
        print(f"     Transcribed text  : \"{result['text']}\"")
    except VoiceServiceError as e:
        print(f"  ❌ FAILED: {e}")


def check_env():
    print("Checking environment variables...")
    required = ["ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID_SO", "ELEVENLABS_VOICE_ID_EN"]
    missing = [v for v in required if not os.environ.get(v)]
    if missing:
        print(f"  ❌ Missing env vars: {', '.join(missing)}")
        print("     Add them to your .env file and re-run.")
        sys.exit(1)
    print(f"  ✅ All required env vars are set.")


if __name__ == "__main__":
    print("=" * 55)
    print("  Maktab AI — Voice Service Smoke Test")
    print("=" * 55)

    check_env()

    somali_mp3 = test_tts_somali()
    english_mp3 = test_tts_english()

    # STT test: feed the Somali MP3 back in
    test_stt(somali_mp3, expected_lang="so")

    print("\n" + "=" * 55)
    print("  Done. Play the .mp3 files to verify audio quality.")
    print("  If STT text looks wrong, check the voice ID in .env.")
    print("=" * 55)
