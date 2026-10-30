#!/bin/bash
set -e
export OP1_AUTH_EXTERNA=1

echo "Iniciando Simulador OP1 Streamlit en segundo plano..."
streamlit run /opt/simulador/simulador_op1.py \
    --server.port=8501 \
    --server.address=127.0.0.1 \
    --server.baseUrlPath=stream \
    --server.enableCORS=false \
    --server.enableXsrfProtection=false \
    --browser.gatherUsageStats=false &

echo "Iniciando Nginx en primer plano..."
nginx -g "daemon off;"
