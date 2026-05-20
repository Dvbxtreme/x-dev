"""Wspólna konfiguracja deployów – czyta dane z .env lub używa domyślnych."""
import os, json
from pathlib import Path

ENV_FILE = Path(__file__).parent / ".env"

def load_env():
    env = {}
    if ENV_FILE.exists():
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

env = load_env()

CONFIG = {
    "host": env.get("SSH_HOST", "neil224.mikrus.xyz"),
    "port": int(env.get("SSH_PORT", "10224")),
    "user": env.get("SSH_USER", "root"),
    "password": env.get("SSH_PASSWORD", ""),
    "local_dir": env.get("LOCAL_DIR", str(Path(__file__).parent)),
    "web_dir": env.get("WEB_DIR", "/var/www/html"),
}

def check_config():
    if not CONFIG["password"]:
        print("UWAGA: Brak hasła SSH. Skopiuj .env.example do .env i uzupełnij dane.")
        print("   cp .env.example .env")
        return False
    return True
