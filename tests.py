"""Podstawowe testy dymne dla strony X-DEV."""
import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
errors = []

def check_file(path, desc):
    if not os.path.exists(path):
        errors.append(f"BRAKUJE: {desc} ({path})")
        return False
    return True

def check_in_file(path, pattern, desc):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if not re.search(pattern, content):
        errors.append(f"BRAKUJE w {path}: {desc}")

def check_not_in_file(path, pattern, desc):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if re.search(pattern, content):
        errors.append(f"ZABRONIONE w {path}: {desc}")

required_files = [
    ('index.html', 'Strona glowna'),
    ('blog.html', 'Blog'),
    ('kariera.html', 'Kariera'),
    ('404.html', 'Strona 404'),
    ('style.css', 'Style CSS'),
    ('script.js', 'Skrypt JS'),
    ('sw.js', 'Service Worker'),
    ('manifest.json', 'Manifest PWA'),
    ('robots.txt', 'Robots'),
    ('sitemap.xml', 'Sitemap'),
    ('send.php', 'Backend formularza'),
    ('polityka-prywatnosci.html', 'Polityka prywatnosci'),
    ('regulamin.html', 'Regulamin'),
    ('.gitignore', 'Gitignore'),
    ('.env.example', 'Przykladowy .env'),
    ('deploy_config.py', 'Konfiguracja deploy'),
]

print("=== Testy dymne X-DEV ===\n")

# 1. Sprawdzenie czy wszystkie pliki istnieja
print("[1/5] Wymagane pliki...")
for fname, desc in required_files:
    check_file(os.path.join(BASE_DIR, fname), desc)

# 2. Sprawdzenie czy haslo nie wycieka
print("[2/5] Bezpieczenstwo...")
deploy_scripts = ['deploy.py', 'deploy_final.py', 'deploy_all.py', 'post_deploy.py', 'check_domain.py']
for script in deploy_scripts:
    path = os.path.join(BASE_DIR, script)
    if os.path.exists(path):
        check_not_in_file(path, r'password\s*=\s*["\'](?!.*os\.environ)', f"Hardcodowane haslo w {script}")
        check_not_in_file(path, r'Fen7vsEpD1', f"Wywciek hasla w {script}")

# 3. Sprawdzenie meta tagow
print("[3/5] Meta tagi i SEO...")
check_in_file(os.path.join(BASE_DIR, 'index.html'), r'<meta name="description"', 'Meta description')
check_in_file(os.path.join(BASE_DIR, 'index.html'), r'<link rel="canonical"', 'Canonical URL')
check_in_file(os.path.join(BASE_DIR, 'blog.html'), r'<meta name="description"', 'Blog meta description')
check_in_file(os.path.join(BASE_DIR, 'kariera.html'), r'<meta name="description"', 'Kariera meta description')

# 4. Sprawdzenie linkow do polityki i regulaminu
print("[4/5] Linki prawne...")
for page in ['index.html', 'blog.html', 'kariera.html']:
    path = os.path.join(BASE_DIR, page)
    check_in_file(path, r'polityka-prywatnosci\.html', f'Link do polityki w {page}')
    check_in_file(path, r'regulamin\.html', f'Link do regulaminu w {page}')

# 5. Sprawdzenie braku auto-generacji bloga
print("[5/5] Auto-generacja bloga...")
check_not_in_file(os.path.join(BASE_DIR, 'blog.html'), r'autoGeneratePosts', 'Auto-generacja w blog.html')
check_not_in_file(os.path.join(BASE_DIR, 'blog.html'), r'const templates\s*=\s*\[', 'Szablony postow automatycznych')

print(f"\n=== Wynik: {len(errors)} bledow ===")
for err in errors:
    print(f"  ! {err}")

if errors:
    sys.exit(1)
else:
    print("OK - wszystkie testy przeszly!")
