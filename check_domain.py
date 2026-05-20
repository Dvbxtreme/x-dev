import paramiko
from deploy_config import CONFIG, check_config

if not check_config():
    exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

cmds = [
    'ls -la /var/www/html/',
    'grep -A10 "server_name.*dvbxtreme" /etc/nginx/sites-enabled/*',
    'curl -s -o /dev/null -w "%{http_code}\n" -H "Host: dvbxtreme.com.pl" http://localhost/',
    'curl -s -o /dev/null -w "%{http_code}\n" -H "Host: www.dvbxtreme.com.pl" http://localhost/',
]
for cmd in cmds:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    if out: print(out)
    print('---')
ssh.close()
