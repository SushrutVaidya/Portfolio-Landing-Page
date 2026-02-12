#!/bin/bash

# Portfolio Docker Build Script
# Builds optimized Docker image for deployment

IMAGE_NAME="portfolio-landing"
TAG="latest"

echo "Building Docker image: $IMAGE_NAME:$TAG"
echo "========================================="

# Build the image
docker build -t $IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Build successful!"
    echo ""

    # Show image size
    echo "Image details:"
    docker images $IMAGE_NAME:$TAG

    echo ""
    echo "Quick commands:"
    echo "  Run locally:    docker run -d -p 8080:80 --name portfolio $IMAGE_NAME:$TAG"
    echo "  Test:           curl http://localhost:8080"
    echo "  View logs:      docker logs portfolio"
    echo "  Stop:           docker stop portfolio"
    echo "  Remove:         docker rm portfolio"
    echo ""
    echo "For EC2 deployment, see EC2-DEPLOY.md"
else
    echo ""
    echo "✗ Build failed"
    exit 1
fi
