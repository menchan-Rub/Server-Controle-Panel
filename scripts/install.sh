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

# インストールディレクトリ
INSTALL_DIR="/opt/server-control-panel"

# 基本パッケージのインストール
echo -e "${BLUE}必要なパッケージをインストールしています...${NC}"
apt-get update
apt-get install -y curl wget git

# Docker のインストール
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}Dockerをインストールしています...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi

# Docker Compose のインストール
if ! command -v docker-compose &> /dev/null; then
    echo -e "${BLUE}Docker Composeをインストールしています...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# GitHubからコードをクローン
echo -e "${BLUE}ソースコードをダウンロードしています...${NC}"
git clone https://github.com/menchan-Rub/Server-Controle-Panel.git $INSTALL_DIR
cd $INSTALL_DIR

# 設定ディレクトリの作成
mkdir -p /etc/server-control-panel/ssl

# SSL証明書の生成
echo -e "${BLUE}SSL証明書を生成しています...${NC}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/server-control-panel/ssl/private.key \
    -out /etc/server-control-panel/ssl/certificate.crt \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Server Control Panel/OU=IT/CN=$(hostname)"

chmod 600 /etc/server-control-panel/ssl/private.key

# 環境変数の設定
echo -e "${BLUE}環境設定を行っています...${NC}"
ADMIN_PASSWORD=$(openssl rand -base64 12)
cat > $INSTALL_DIR/.env << EOL
PANEL_PORT=10000
PANEL_SSL_KEY=/etc/server-control-panel/ssl/private.key
PANEL_SSL_CERT=/etc/server-control-panel/ssl/certificate.crt
ADMIN_PASSWORD=$ADMIN_PASSWORD
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOL

# systemdサービスの設定
echo -e "${BLUE}サービスをインストールしています...${NC}"
cat > /etc/systemd/system/server-control-panel.service << EOL
[Unit]
Description=Server Control Panel
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# サービスの起動
systemctl daemon-reload
systemctl enable server-control-panel
systemctl start server-control-panel

# ファイアウォールの設定（UFWが存在する場合）
if command -v ufw &> /dev/null; then
    ufw allow 10000/tcp
fi

# 完了メッセージ
echo -e "${GREEN}インストールが完了しました！${NC}"
echo -e "${GREEN}管理パネルには以下のURLでアクセスできます：${NC}"
echo -e "${GREEN}https://$(hostname):10000${NC}"
echo -e "${GREEN}初期管理者パスワード: $ADMIN_PASSWORD${NC}"
echo -e "${BLUE}セキュリティのため、すぐにパスワードを変更してください。${NC}"

# ログの表示方法
echo -e "\n${BLUE}ログを確認するには以下のコマンドを使用してください：${NC}"
echo "journalctl -u server-control-panel -f"
