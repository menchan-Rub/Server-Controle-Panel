#!/bin/bash

# サービスの停止と削除
systemctl stop server-control-panel
systemctl disable server-control-panel
rm /etc/systemd/system/server-control-panel.service
systemctl daemon-reload

# Dockerコンテナとボリュームの削除
cd /opt/server-control-panel
docker-compose down -v

# ファイルの削除
cd /
rm -rf /opt/server-control-panel
rm -rf /etc/server-control-panel

echo "Server Control Panelのアンインストールが完了しました"

