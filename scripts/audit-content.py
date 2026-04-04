#!/usr/bin/env python3
"""
Content auditor using Kimi (Moonshot) API.
Reads translation files, sends to Kimi for AI slop detection and copy improvement.
Usage: python3 scripts/audit-content.py [--fix]
"""

import json, os, sys, re, urllib.request

# Load API key from .env.local
ENV_PATH = os.path.join(os.path.dirname(__file__), '..', '.env.local')
API_KEY = None
with open(ENV_PATH) as f:
    for line in f:
        if line.startswith('KIMI_API_KEY='):
            API_KEY = line.strip().split('=', 1)[1]
            break

if not API_KEY:
    print("ERROR: KIMI_API_KEY not found in .env.local")
    sys.exit(1)

URL = "https://api.moonshot.cn/v1/chat/completions"
MODEL = "moonshot-v1-8k"

def call_kimi(system_prompt: str, user_prompt: str) -> str:
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3,
    }).encode()

    req = urllib.request.Request(URL, data=payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    })

    resp = urllib.request.urlopen(req, timeout=60)
    data = json.loads(resp.read())
    return data["choices"][0]["message"]["content"]

# Read translation files
BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'i18n', 'translations')
es_path = os.path.join(BASE, 'es.ts')
en_path = os.path.join(BASE, 'en.ts')

with open(es_path) as f:
    es_content = f.read()
with open(en_path) as f:
    en_content = f.read()

SYSTEM_PROMPT = """You are a content auditor for a Chilean school management platform called Ethoz.
Your job is to find AI-generated slop in marketing copy.

The audience is Chilean school directors — non-technical, conservative buyers.
The tone should be: precise, concrete, authoritative. Every word earns its place.

AI SLOP PATTERNS TO FLAG:
1. Buzzwords: "seamless", "cutting-edge", "next-gen", "elevate", "unleash", "empower", "leverage", "robust", "holistic", "synergy"
2. Filler adverbs: "específicamente", "fundamentalmente", "estructuralmente", "efectivamente", "estrictamente", "básicamente"
3. Empty phrases: "de forma integral", "de manera eficiente", "en tiempo real" (when not literal), "de última generación"
4. Self-congratulatory: "diseñado desde cero para", "construido con la más alta", "la solución más completa"
5. Repetitive sentence patterns: subject-verb-object repeated 3+ times
6. Walls of text: FAQ answers over 3 sentences
7. Jargon a school director wouldn't understand
8. Generic marketing: could apply to any product, not specifically Ethoz/schools

OUTPUT FORMAT:
For each issue found, output:
- LINE: the translation key
- ISSUE: what's wrong
- SUGGESTION: concrete fix (rewrite the text)

If the copy is clean, say "NO ISSUES FOUND".
Be strict. Flag everything that doesn't earn its place."""

print("=" * 60)
print("ETHOZ CONTENT AUDIT — Powered by Kimi")
print("=" * 60)

# Audit Spanish
print("\n📋 Auditing Spanish translations...")
es_result = call_kimi(SYSTEM_PROMPT, f"Audit this Spanish marketing copy for AI slop:\n\n{es_content[:12000]}")
print(es_result)

print("\n" + "=" * 60)

# Audit English
print("\n📋 Auditing English translations...")
en_result = call_kimi(SYSTEM_PROMPT, f"Audit this English marketing copy for AI slop:\n\n{en_content[:12000]}")
print(en_result)

print("\n" + "=" * 60)
print("✅ Audit complete. Review suggestions above.")
print("To apply fixes, edit src/lib/i18n/translations/es.ts and en.ts")
