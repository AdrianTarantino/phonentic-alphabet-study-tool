"""Builds lib/espeak-map.json from the probe results.

Usage: python3 build-map.py probe.json targets.json ../../lib/espeak-map.json

probe.json comes from probe.cjs: for every eSpeak voice, the IPA that eSpeak
prints (with --ipa) for each of that voice's phoneme codes. targets.json is the
list of symbols in lib/ipa.ts. Only sounds made of those symbols (plus the
length mark) are kept.
"""
import json, re, sys, unicodedata

probe_path, targets_path, out_path = sys.argv[1:4]
probe = json.load(open(probe_path))
targets = json.load(open(targets_path))

def norm(s):
    s = unicodedata.normalize("NFC", s).replace("͡", "").replace("͜", "")
    return re.sub(r"[ˈˌ0-9\-_]", "", s).strip()  # stress marks and tone digits

allowed = set("".join(norm(t) for t in targets)) | {"ː"}
allowed -= set(" .")
target_sounds = {norm(t) for t in targets} - {"", "."}

by_voice = {}
for result in probe:
    if result["err"]:
        continue  # voice not included in this eSpeak build
    sounds = {}
    for code, out in result["map"].items():
        out = out.strip()
        if not out or " " in out:
            continue
        ipa = norm(out)
        if not ipa or not set(ipa) <= allowed:
            continue
        if ipa not in sounds or len(code) < len(sounds[ipa]):
            sounds[ipa] = code  # prefer the simplest code for a sound
    by_voice[result["voice"]] = sounds

coverage = {v: len(set(s) & target_sounds) for v, s in by_voice.items()}
# English voices first (when several voices can say a whole word, the first
# one wins), then the voices that cover the most table symbols.
PREFERRED = ["en-us", "en-gb"]
voice_order = sorted(by_voice, key=lambda v: (PREFERRED.index(v) if v in PREFERRED else len(PREFERRED), -coverage[v], v))

ipa_map = {}
for voice in voice_order:
    for ipa, code in by_voice[voice].items():
        ipa_map.setdefault(ipa, {})[voice] = code

json.dump({"voiceOrder": voice_order, "map": dict(sorted(ipa_map.items()))},
          open(out_path, "w"), ensure_ascii=False, separators=(",", ":"))
missing = sorted(target_sounds - set(ipa_map))
print(f"{len(ipa_map)} sounds, {len(voice_order)} voices; table symbols with no eSpeak sound: {' '.join(missing)}")
