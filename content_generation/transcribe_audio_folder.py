#!/usr/bin/env python3
"""
Ultra‑simple local **Whisper** batch‑transcriber.

**How to use it**
-----------------
1. Drop your audio files (WAV, MP3, FLAC, …) into the **`audio/`** folder.
2. Install requirements:
   ```bash
   pip install openai-whisper tqdm      # inside your venv
   sudo apt-get install -y ffmpeg       # one‑time system dep
   ```
3. Run the script:
   ```bash
   python transcribe_audio_folder.py
   ```

Each `name.ext` becomes `name.txt` right next to it.  The first run will
download Whisper **large‑v3** weights (~3 GB); afterwards you can work fully
offline.
"""
from pathlib import Path

import whisper
from tqdm import tqdm

# ---- simple knobs you can tweak -------------------------------------------
AUDIO_DIR = Path("audio")          # folder to scan
MODEL_NAME = "large-v3-turbo"      # or "large-v3" for slightly more accuracy
FP16 = False                       # set True if your GPU supports float16
# ---------------------------------------------------------------------------

def main() -> None:
    if not AUDIO_DIR.exists():
        raise SystemExit(f"Folder not found: {AUDIO_DIR.resolve()}")

    files = [p for p in AUDIO_DIR.iterdir() if p.is_file() and not p.suffix == ".txt"]
    if not files:
        raise SystemExit(f"No audio files in {AUDIO_DIR}/")

    print(f"🎧 Found {len(files)} file(s) → loading Whisper {MODEL_NAME} …")
    model = whisper.load_model(MODEL_NAME)

    for f in tqdm(files, desc="Transcribing", unit="file"):
        txt = f.with_suffix(".txt")
        if txt.exists():
            continue  # idempotent
        result = model.transcribe(str(f), fp16=FP16)
        txt.write_text(result["text"].strip() + "\n", encoding="utf-8")

    print("✅ All transcripts saved.")


if __name__ == "__main__":
    main()
