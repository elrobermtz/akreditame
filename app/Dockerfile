# Stage 1: Build React SPA
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/ ./
RUN npm run build

# Stage 2: Production container with Python, Streamlit and Nginx
FROM python:3.13-slim AS production-stage

WORKDIR /opt/simulador

# Install nginx and configure logs to stdout/stderr
RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    rm -rf /var/lib/apt/lists/*

# Install simulator dependencies
COPY op1_web/requirements.txt /opt/simulador/
RUN pip install --no-cache-dir -r /opt/simulador/requirements.txt

# Copy simulator files
COPY op1_web/ /opt/simulador/

# Copy React static files
COPY --from=build-stage /app/dist /var/www/html

# Copy Nginx configuration
COPY app/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy entrypoint script
COPY app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
