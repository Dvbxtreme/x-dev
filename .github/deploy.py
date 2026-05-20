import os, sys

# Read config from environment (set by GitHub Actions secrets)
host = os.environ.get('SSH_HOST')
port = int(os.environ.get('SSH_PORT', '22'))
user = os.environ.get('SSH_USER')
password = os.environ.get('SSH_PASSWORD')

if not all([host, port, user, password]):
    print('ERROR: Missing SSH_HOST, SSH_PORT, SSH_USER, or SSH_PASSWORD')
    sys.exit(1)

import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=user, password=password)

sftp = ssh.open_sftp()
web = '/var/www/html'
files = [
    'index.html', 'style.css', 'script.js',
    'manifest.json', 'sw.js',
    'blog.html', 'kariera.html', '404.html',
    'favicon.ico', 'robots.txt', 'sitemap.xml',
    'polityka-prywatnosci.html', 'regulamin.html',
    'send.php',
]
for f in files:
    remote = f'{web}/{f}'
    if os.path.exists(f):
        sftp.put(f, remote)
        print(f'OK: {f}')

for d in ['icons', 'portfolio']:
    try:
        sftp.mkdir(f'{web}/{d}')
    except:
        pass
    for f in os.listdir(d):
        sftp.put(os.path.join(d, f), f'{web}/{d}/{f}')

sftp.close()
ssh.exec_command('nginx -s reload')
ssh.close()
print('Deploy OK!')
