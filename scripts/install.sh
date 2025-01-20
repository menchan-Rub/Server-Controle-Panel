#!/bin/bash

# 色の設定
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# root権限チェック
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}このスクリプトはroot権限で実行してください${NC}"
  exit 1
fi

echo -e "${BLUE}Server Control Panel インストーラー${NC}"

# 作業ディレクトリの作成と移動
INSTALL_DIR="/opt/server-control-panel"
echo -e "${BLUE}インストールディレクトリを作成しています...${NC}"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# 基本パッケージのインストール
echo -e "${BLUE}必要なパッケージをインストールしています...${NC}"
apt-get update
apt-get install -y curl wget git docker.io docker-compose

# Dockerサービスの開始
systemctl start docker
systemctl enable docker

# 設定ディレクトリの作成
mkdir -p /etc/server-control-panel/ssl

# 管理者パスワードの生成
ADMIN_PASSWORD=$(openssl rand -base64 12)

# 環境変数ファイルの作成
echo -e "${BLUE}環境変数を設定しています...${NC}"
cat > $INSTALL_DIR/.env << EOL
PANEL_PORT=10000
PANEL_SSL_KEY=/etc/server-control-panel/ssl/private.key
PANEL_SSL_CERT=/etc/server-control-panel/ssl/certificate.crt
ADMIN_PASSWORD=$ADMIN_PASSWORD
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOL

# SSL証明書の生成
echo -e "${BLUE}SSL証明書を生成しています...${NC}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/server-control-panel/ssl/private.key \
    -out /etc/server-control-panel/ssl/certificate.crt \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Server Control Panel/OU=IT/CN=localhost"

chmod 600 /etc/server-control-panel/ssl/private.key

# GitHubからコードをクローン
echo -e "${BLUE}ソースコードをダウンロードしています...${NC}"
git clone https://github.com/menchan-Rub/Server-Controle-Panel.git .

# systemdサービスの設定
echo -e "${BLUE}システムサービスを設定しています...${NC}"
cat > /etc/systemd/system/server-control-panel.service << EOL
[Unit]
Description=Server Control Panel
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=/opt/server-control-panel
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# サービスの有効化と起動
systemctl daemon-reload
systemctl enable server-control-panel
systemctl start server-control-panel

# 完了メッセージ
echo -e "${GREEN}インストールが完了しました！${NC}"
echo -e "${GREEN}管理パネルには以下のURLでアクセスできます：${NC}"
echo -e "${GREEN}https://127.0.0.1:10000${NC}"
echo -e "${GREEN}初期管理者パスワード: $ADMIN_PASSWORD${NC}"
echo -e "${BLUE}セキュリティのため、すぐにパスワードを変更してください。${NC}"

# パスワードをファイルに保存（安全な場所に）
echo $ADMIN_PASSWORD > /etc/server-control-panel/admin_password.txt
chmod 600 /etc/server-control-panel/admin_password.txt

echo -e "${BLUE}パスワードは /etc/server-control-panel/admin_password.txt に保存されました${NC}"

