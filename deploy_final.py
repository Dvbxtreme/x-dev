import paramiko, os
from deploy_config import CONFIG, check_config

if not check_config():
    exit(1)

local = CONFIG["local_dir"]
web = CONFIG["web_dir"]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

sftp = ssh.open_sftp()

for item in ["index.html", "style.css", "script.js", "manifest.json", "sw.js"]:
    sftp.put(os.path.join(local, item), f"{web}/{item}")
    print(f"OK: {item}")

try:
    sftp.mkdir(f"{web}/icons")
except:
    pass
for f in os.listdir(os.path.join(local, "icons")):
    sftp.put(os.path.join(local, "icons", f), f"{web}/icons/{f}")
    print(f"OK: icons/{f}")

sftp.close()

stdin, stdout, stderr = ssh.exec_command("nginx -s reload")
ssh.close()

print("Deploy done!")
