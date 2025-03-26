#!/bin/bash
set -e

echo "Starting server..."

# Copy client build to server's public directory
echo "Copying client build to server..."
mkdir -p server/public
cp -r client/dist/* server/public/

# Make sure server dependencies are installed
cd server
npm install

# Set NODE_PATH to include server/node_modules
export NODE_PATH=/opt/render/project/src/server/node_modules:$NODE_PATH

# Start the server
node server.js 