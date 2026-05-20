import paramiko, sys
sys.path.insert(0, r'C:\Users\SEBASTIAN\Desktop\nexus-agency')
from deploy_config import CONFIG, check_config
if not check_config(): sys.exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

cmds = [
    "curl -sI https://dvbxtreme.com.pl 2>/dev/null | head -30 || echo 'HTTPS nie dziala'",
    "curl -sI http://dvbxtreme.com.pl 2>/dev/null | head -10 || echo 'HTTP nie dziala'",
    "ls /etc/nginx/sites-enabled/ 2>/dev/null",
    "cat /etc/nginx/sites-enabled/* 2>/dev/null | grep -E 'ssl_certificate|return 301|add_header|HSTS|Strict-Transport|Content-Security' || echo 'Brak naglowkow SSL/HSTS/CSP'",
    "which certbot 2>/dev/null && certbot certificates 2>/dev/null | head -10 || echo 'Brak certbota'",
]

for cmd in cmds:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()[:500]
    err = stderr.read().decode().strip()[:200]
    print(f"$ {cmd}")
    if out: print(out)
    if err: print(err)
    print("---")
ssh.close()
