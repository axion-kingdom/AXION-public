#!/usr/bin/env python3
"""Fail-closed public surface scan. Patterns are assembled at runtime."""
import sys
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
SKIP = {".git", "node_modules", "dist", "coverage"}


def parts(*items):
    return "".join(items)


PATTERNS = [
    parts("PROD", "_", "SSH", "_"),
    parts("PRODUCTION", "_", "DOMAIN"),
    parts("VPS", "_"),
    parts("C2", "_", "HUB", "_", "SECRET"),
    parts("SLACK", "_", "WEBHOOK"),
    parts("SLACK", "_", "BOT", "_", "TOKEN"),
    parts("TELEGRAM", "_", "BOT", "_", "TOKEN"),
    parts("DATABASE", "_", "URL", "_", "CENTRAL"),
    parts("DATABASE", "_", "URL"),
    parts("SUPABASE", "_", "SERVICE", "_", "ROLE", "_", "KEY"),
    parts("FIREBASE", "_", "ADMIN"),
    parts("GOOGLE", "_", "APPLICATION", "_", "CREDENTIALS"),
    parts("VERCEL", "_", "TOKEN"),
    parts("/", "home", "/", "administrator"),
    parts("93", ".", "127", ".", "142", ".", "144"),
    parts("app2", ".", "binar", "joinanelytic", ".", "info"),
    parts("binar", "joinanelytic", ".", "info"),
    parts("self", "-", "hosted"),
    parts("ssh", " -"),
    parts("scp", " "),
    parts("-"*5, "BEGIN ", "OPENSSH", " PRIVATE", " KEY", "-----"),
    parts("-"*5, "BEGIN ", "RSA", " PRIVATE", " KEY", "-----"),
    parts("-"*5, "BEGIN ", "PRIVATE", " KEY", "-----"),
    parts("ghp", "_"),
    parts("github", "_pat_"),
    parts("xoxb", "-"),
    parts("xoxp", "-"),
]


def main():
    failures = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP for part in path.parts):
            continue
        if path.stat().st_size > 1_500_000:
            failures.append(f"{path}: oversized")
            continue
        data = path.read_bytes()
        if b"\0" in data[:800]:
            continue
        text = data.decode("utf-8", "replace")
        for pattern in PATTERNS:
            if pattern and pattern in text:
                failures.append(f"{path}: forbidden marker")
                break
    if failures:
        print("PUBLIC_SURFACE_SCAN FAIL")
        for item in failures:
            print(item)
        return 1
    print("PUBLIC_SURFACE_SCAN PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
