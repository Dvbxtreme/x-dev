import paramiko
import sys
sys.path.insert(0, r'C:\Users\SEBASTIAN\Desktop\nexus-agency')
from deploy_config import CONFIG, check_config

if not check_config():
    sys.exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

cmds = [
    "which php 2>/dev/null",
    "php -v 2>/dev/null | head -1",
    "php -m 2>/dev/null | grep -i mail",
    "which sendmail 2>/dev/null || which postfix 2>/dev/null || which msmtp 2>/dev/null || echo 'BRAK MTA'",
    "dpkg -l 2>/dev/null | grep -iE 'sendmail|postfix|msmtp|mailutils' || echo 'BRAK PAKIETOW'",
    "ls /etc/php/ 2>/dev/null || echo 'BRAK KATALOGU PHP'",
    "curl -s -o /dev/null -w '%{http_code}' http://localhost/send.php 2>/dev/null || echo 'send.php nie istnieje'",
]

for cmd in cmds:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()[:100]
    print(f"$ {cmd}")
    if out: print(f"  > {out}")
    if err: print(f"  ! {err}")
    print()

ssh.close()
