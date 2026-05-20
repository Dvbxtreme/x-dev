import paramiko, os, glob
from deploy_config import CONFIG, check_config

if not check_config():
    exit(1)

local = CONFIG["local_dir"]
web = CONFIG["web_dir"]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])
sftp = ssh.open_sftp()

files = ["index.html", "style.css", "script.js", "manifest.json", "sw.js",
         "blog.html", "kariera.html", "404.html", "favicon.ico", "robots.txt",
         "sitemap.xml", "polityka-prywatnosci.html", "regulamin.html"]
for f in files:
    local_path = os.path.join(local, f)
    if os.path.exists(local_path):
        sftp.put(local_path, f"{web}/{f}")
        print(f"OK: {f}")
    else:
        print(f"Brak: {f} (pominięty)")

try:
    sftp.mkdir(f"{web}/icons")
except:
    pass
for f in os.listdir(os.path.join(local, "icons")):
    sftp.put(os.path.join(local, "icons", f), f"{web}/icons/{f}")

try:
    sftp.mkdir(f"{web}/portfolio")
except:
    pass
for f in os.listdir(os.path.join(local, "portfolio")):
    sftp.put(os.path.join(local, "portfolio", f), f"{web}/portfolio/{f}")

sftp.close()
ssh.exec_command("nginx -s reload")
ssh.close()
print("All done!")
