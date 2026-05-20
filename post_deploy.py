import paramiko, os
from deploy_config import CONFIG, check_config

if not check_config():
    exit(1)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(CONFIG["host"], port=CONFIG["port"], username=CONFIG["user"], password=CONFIG["password"])

cmds = [
    'nginx -s reload 2>&1',
    'mkdir -p ~/.ssh && chmod 700 ~/.ssh',
    'chmod 600 ~/.ssh/authorized_keys',
    'curl -s -o /dev/null -w "%{http_code}\n" http://localhost/',
]

stdin, stdout, stderr = ssh.exec_command('nginx -s reload 2>&1')
print('reload:', stdout.read().decode().strip())

stdin, stdout, stderr = ssh.exec_command('mkdir -p ~/.ssh && chmod 700 ~/.ssh')
stdout.read()

ssh_pub = os.path.expanduser('~/.ssh/id_rsa.pub')
if os.path.exists(ssh_pub):
    pubkey = open(ssh_pub).read().strip()
    transport = ssh.get_transport()
    channel = transport.open_session()
    channel.exec_command('cat >> ~/.ssh/authorized_keys')
    channel.send(pubkey + '\n')
    channel.shutdown_write()
    channel.close()
    ssh.exec_command('chmod 600 ~/.ssh/authorized_keys')
    print('SSH key added')
else:
    print('Brak ~/.ssh/id_rsa.pub – pomijam dodawanie klucza')

stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}\n" http://localhost/')
print('http_status:', stdout.read().decode().strip())

ssh.close()
