#!/bin/bash

SSL_DIR="/etc/server-control-panel/ssl"
mkdir -p $SSL_DIR

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $SSL_DIR/private.key \
    -out $SSL_DIR/certificate.crt \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Server Control Panel/OU=IT/CN=localhost"

chmod 600 $SSL_DIR/private.key

