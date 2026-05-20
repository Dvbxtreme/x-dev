import paramiko, sys
sys.path.insert(0, r'C:\Users\SEBASTIAN\Desktop\nexus-agency')
from deploy_config import CONFIG, check_config
if not check_config(): sys.exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

# Sprawdź przez HTTPS na localhost (omija Cloudflare ale uzywa SSL)
stdin, stdout, stderr = ssh.exec_command('curl -sIk https://localhost/ 2>/dev/null | head -20')
print("=== HTTPS localhost headers ===")
print(stdout.read().decode()[:800])

# Sprawdź przez HTTP na localhost
stdin, stdout, stderr = ssh.exec_command('curl -sI http://localhost/ 2>/dev/null | head -20')
print("=== HTTP localhost headers ===")
print(stdout.read().decode()[:800])

ssh.close()
