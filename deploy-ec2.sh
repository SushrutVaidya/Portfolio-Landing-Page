#!/bin/bash

# Quick EC2 Docker Deployment
# Run this script on your EC2 instance after transferring files

set -e

IMAGE_NAME="portfolio-landing"

echo "==================================="
echo "Portfolio EC2 Docker Deployment"
echo "==================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."

    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    fi

    if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
        # Amazon Linux / RHEL
        sudo yum update -y
        sudo yum install docker -y
    elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        # Ubuntu / Debian
        sudo apt update
        sudo apt install docker.io -y
    fi

    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER

    echo "Docker installed. Please logout and login again, then re-run this script."
    exit 0
fi

# Stop and remove old container
echo "Cleaning up old containers..."
docker stop portfolio-container 2>/dev/null || true
docker rm portfolio-container 2>/dev/null || true
docker rmi $IMAGE_NAME:latest 2>/dev/null || true

# Build image
echo ""
echo "Building Docker image..."
docker build -t $IMAGE_NAME:latest .

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Run container
echo ""
echo "Starting container..."
docker run -d \
    -p 80:80 \
    --name portfolio-container \
    --restart unless-stopped \
    $IMAGE_NAME:latest

# Check if container is running
sleep 2
if docker ps | grep -q portfolio-container; then
    echo ""
    echo "========================================="
    echo "✓ Deployment successful!"
    echo "========================================="
    echo ""
    echo "Your portfolio is now running!"
    echo ""

    # Get public IP
    PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "YOUR_EC2_IP")
    echo "Access at: http://$PUBLIC_IP"
    echo ""

    echo "Useful commands:"
    echo "  View logs:    docker logs -f portfolio-container"
    echo "  Restart:      docker restart portfolio-container"
    echo "  Stop:         docker stop portfolio-container"
    echo "  Rebuild:      ./deploy-ec2.sh"
    echo ""
else
    echo "Failed to start container!"
    echo "Check logs: docker logs portfolio-container"
    exit 1
fi
