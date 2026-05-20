import paramiko, sys, os, tempfile
sys.path.insert(0, r'C:\Users\SEBASTIAN\Desktop\nexus-agency')
from deploy_config import CONFIG, check_config
if not check_config(): sys.exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

sftp = ssh.open_sftp()

# Usun ewentualne smieci z poprzednich prob
ssh.exec_command("rm -f /etc/nginx/sites-enabled/default.backup")

# Pobierz config
local_old = os.path.join(tempfile.gettempdir(), "xdev_nginx_old")
sftp.get("/etc/nginx/sites-enabled/default", local_old)
with open(local_old, "r", encoding="utf-8") as f:
    config = f.read()

changes = []

if "Strict-Transport-Security" not in config:
    config = config.replace(
        "add_header Referrer-Policy",
        'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\n    add_header Referrer-Policy'
    )
    changes.append("HSTS")

if "Content-Security-Policy" not in config:
    config = config.replace(
        "add_header X-Content-Type-Options",
        'add_header Content-Security-Policy "default-src \'self\'; script-src \'self\' https://cdnjs.cloudflare.com https://www.googletagmanager.com https://formsubmit.co; style-src \'self\' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src \'self\' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src \'self\' data:; connect-src \'self\' https://formsubmit.co; frame-src \'self\' https://www.google.com; object-src \'none\'; base-uri \'self\'" always;\n    add_header X-Content-Type-Options'
    )
    changes.append("CSP")

if "Permissions-Policy" not in config:
    config = config.replace(
        "add_header X-Content-Type-Options",
        'add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;\n    add_header X-Content-Type-Options'
    )
    changes.append("Permissions-Policy")

if not changes:
    print("Wszystkie naglowki juz istnieja")
    sftp.close()
    ssh.close()
    sys.exit(0)

# Zapisz zmodyfikowany lokalnie i wgraj
local_new = os.path.join(tempfile.gettempdir(), "xdev_nginx_new")
with open(local_new, "w", encoding="utf-8") as f:
    f.write(config)

sftp.put(local_new, "/etc/nginx/sites-enabled/default")
sftp.close()
os.remove(local_old)
os.remove(local_new)

ssh.exec_command("nginx -t 2>&1")
stdin, stdout, stderr = ssh.exec_command("nginx -t 2>&1")
result = (stdout.read().decode().strip() + stderr.read().decode().strip()).strip()

if "successful" in result:
    ssh.exec_command("nginx -s reload")
    print(f"Dodano: {', '.join(changes)}")
    print("Nginx przeladowany OK")
else:
    print(f"Blad: {result[:300]}")
    print("KONFIGURACJA ODRZUCONA - nginx dziala na starej")

ssh.close()
