#!/bin/bash

# Script de deploy para VPS
# Uso: ./deploy.sh

echo "🚀 Iniciando deploy..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/var/www/Dashboard"

# Navegar al proyecto
cd $PROJECT_DIR || exit

echo "${YELLOW}📥 Pulling latest changes from Git...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo "${RED}❌ Error pulling from Git${NC}"
    exit 1
fi

echo "${YELLOW}🛑 Stopping containers...${NC}"
docker compose down

echo "${YELLOW}🔨 Building containers...${NC}"
docker compose build --no-cache

if [ $? -ne 0 ]; then
    echo "${RED}❌ Error building containers${NC}"
    exit 1
fi

echo "${YELLOW}🚀 Starting containers...${NC}"
docker compose up -d

if [ $? -ne 0 ]; then
    echo "${RED}❌ Error starting containers${NC}"
    exit 1
fi

echo "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

echo "${YELLOW}📊 Checking container status...${NC}"
docker compose ps

echo "${GREEN}✅ Deploy completed successfully!${NC}"
echo ""
echo "🔍 Check logs with: docker compose logs -f"
echo "🌐 Access: https://your-domain.com"
