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

# インストールディレクトリの作成
INSTALL_DIR="/opt/server-control-panel"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# 設定ディレクトリの作成
mkdir -p /etc/server-control-panel/{ssl,configs}

# SSL証明書の生成
./scripts/generate-ssl.sh

# 環境変数の設定
./scripts/setup-env.sh

# サービスのインストール
./scripts/install-service.sh

# 完了メッセージ
echo -e "${GREEN}インストールが完了しました！${NC}"
echo -e "${GREEN}管理パネルには以下のURLでアクセスできます：${NC}"
echo -e "${GREEN}https://$(hostname):10000${NC}"
echo -e "${GREEN}初期管理者パスワード: $(grep ADMIN_PASSWORD .env | cut -d '=' -f2)${NC}"
echo -e "${BLUE}セキュリティのため、すぐにパスワードを変更してください。${NC}"

