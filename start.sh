#!/bin/bash

# Default port is 80, but can be overridden by setting PORT env variable
export PORT=${PORT:-80}

echo "Stopping any existing PM2 processes for dodox-app..."
pm2 stop dodox-app 2>/dev/null || true

echo "Installing dependencies..."
npm install

echo "Building the application for production..."
npm run build

echo "Starting the production server on port $PORT..."
# Using PM2 to run the compiled production entry point
pm2 start dist/server/index.js --name "dodox-app" --update-env

echo "Application started! Checking logs..."
pm2 logs dodox-app --lines 20
