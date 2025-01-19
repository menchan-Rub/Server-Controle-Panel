#!/bin/bash

cd /opt/server-control-panel

# 現在の設定をバックアップ
cp .env .env.backup

# コードの更新
git pull

# 環境変数の更新（新しい変数がある場合）
./scripts/merge-env.sh .env.backup .env

# サービスの再起動
docker-compose down
docker-compose up -d --build

