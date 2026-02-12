#!/bin/bash

# EC2 Deployment Script for Portfolio

echo "Portfolio EC2 Deployment"
echo "======================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing..."
    sudo yum install docker -y || sudo apt install docker.io -y
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "Docker installed successfully"
fi

# Stop and remove existing container
echo "Stopping existing container..."
docker stop portfolio-container 2>/dev/null
docker rm portfolio-container 2>/dev/null

# Build new image
echo "Building Docker image..."
docker build -t portfolio .

# Check if SSL certificates exist
if [ -d "/etc/letsencrypt/live" ]; then
    DOMAIN=$(ls /etc/letsencrypt/live | head -n 1)
    if [ -n "$DOMAIN" ]; then
        echo "SSL certificates found for $DOMAIN"
        echo "Starting container with HTTPS on port 443..."

        # Use SSL config and mount certificates
        docker run -d \
            -p 80:80 \
            -p 443:443 \
            -v /etc/letsencrypt/live/$DOMAIN/fullchain.pem:/etc/nginx/ssl/fullchain.pem:ro \
            -v /etc/letsencrypt/live/$DOMAIN/privkey.pem:/etc/nginx/ssl/privkey.pem:ro \
            --name portfolio-container \
            portfolio

        echo "Container started with SSL"
        echo "Access at: https://$DOMAIN"
    fi
else
    echo "No SSL certificates found"
    echo "Starting container on HTTP port 80..."

    docker run -d \
        -p 80:80 \
        --name portfolio-container \
        portfolio

    echo "Container started without SSL"
    echo "Access at: http://$(curl -s http://checkip.amazonaws.com)"
fi

echo ""
echo "Deployment complete!"
echo ""
echo "Useful commands:"
echo "  docker logs portfolio-container    # View logs"
echo "  docker restart portfolio-container # Restart"
echo "  docker stop portfolio-container    # Stop"
echo ""
