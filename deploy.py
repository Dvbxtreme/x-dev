import paramiko, os
from deploy_config import CONFIG, check_config

if not check_config():
    exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])
print("Connected!")

stdin, stdout, stderr = ssh.exec_command("ls -la /var/www/ 2>/dev/null || ls -la /home/ 2>/dev/null || echo 'no dir'")
output = stdout.read().decode() + stderr.read().decode()
print("Current structure:", output)

web_dir = "/var/www/"
stdin, stdout, stderr = ssh.exec_command(f"test -d {web_dir} && echo exists || echo notfound")
out = stdout.read().decode().strip()
if out == "notfound":
    web_dir = "/home/"

print(f"Using web dir: {web_dir}")

stdin, stdout, stderr = ssh.exec_command(f"rm -rf {web_dir}*")
stdout.read()
print("Old files removed!")

sftp = ssh.open_sftp()

files_to_upload = ["index.html", "style.css", "script.js", "manifest.json", "sw.js"]
for f in files_to_upload:
    local = os.path.join(CONFIG["local_dir"], f)
    remote = os.path.join(web_dir, f)
    sftp.put(local, remote)
    print(f"Uploaded: {f}")

icons_dir = os.path.join(CONFIG["local_dir"], "icons")
try:
    sftp.mkdir(os.path.join(web_dir, "icons"))
except:
    pass
for f in os.listdir(icons_dir):
    local = os.path.join(icons_dir, f)
    remote = os.path.join(web_dir, "icons", f)
    sftp.put(local, remote)
    print(f"Uploaded: icons/{f}")

sftp.close()

stdin, stdout, stderr = ssh.exec_command(f"ls -la {web_dir}")
print("Final files:", stdout.read().decode())

ssh.close()
print("Done!")
