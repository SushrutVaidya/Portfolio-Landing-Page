#!/bin/bash

# Portfolio Landing Page - Quick Start Script

echo "🎬 Portfolio Landing Page - Docker Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker found!"
echo ""

# Ask for Docker image name
read -p "Enter Docker image name (default: portfolio-landing): " IMAGE_NAME
IMAGE_NAME=${IMAGE_NAME:-portfolio-landing}

# Ask for port
read -p "Enter port to run on (default: 8080): " PORT
PORT=${PORT:-8080}

echo ""
echo "📦 Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting container on port $PORT..."
    docker run -d -p $PORT:80 --name portfolio-container $IMAGE_NAME

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Container started successfully!"
        echo ""
        echo "🌐 Your portfolio is now running at:"
        echo "   http://localhost:$PORT"
        echo ""
        echo "📝 Useful commands:"
        echo "   Stop:    docker stop portfolio-container"
        echo "   Start:   docker start portfolio-container"
        echo "   Remove:  docker rm -f portfolio-container"
        echo "   Logs:    docker logs portfolio-container"
        echo ""
    else
        echo ""
        echo "❌ Failed to start container"
        echo "💡 Try stopping any existing container:"
        echo "   docker rm -f portfolio-container"
    fi
else
    echo ""
    echo "❌ Build failed. Please check the error messages above."
fi
