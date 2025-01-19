#!/bin/bash

# 環境変数ファイルの生成
cat > .env << EOL
PANEL_PORT=10000
PANEL_SSL_KEY=/etc/server-control-panel/ssl/private.key
PANEL_SSL_CERT=/etc/server-control-panel/ssl/certificate.crt
ADMIN_PASSWORD=$(openssl rand -base64 12)
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)
EOL

