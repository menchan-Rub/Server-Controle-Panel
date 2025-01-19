#!/bin/bash

# systemdサービスの設定
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

