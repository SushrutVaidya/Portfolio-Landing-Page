# Docker Quick Reference

## 🚀 Quick Start (Automated)

```bash
./start.sh
```

This script will:
1. Check if Docker is installed
2. Build the image
3. Run the container
4. Display the URL to access your portfolio

---

## 🛠️ Manual Docker Commands

### Build Image

```bash
docker build -t portfolio-landing .
```

### Run Container

```bash
docker run -d -p 8080:80 --name portfolio portfolio-landing
```

Access at: http://localhost:8080

### Stop Container

```bash
docker stop portfolio
```

### Start Container (if already created)

```bash
docker start portfolio
```

### Remove Container

```bash
docker rm -f portfolio
```

### View Logs

```bash
docker logs portfolio
```

### View Running Containers

```bash
docker ps
```

### Access Container Shell

```bash
docker exec -it portfolio sh
```

---

## 🌐 Deploy to Cloud

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag portfolio-landing your-username/portfolio:latest

# Push to Docker Hub
docker push your-username/portfolio:latest

# Pull and run on any server
docker pull your-username/portfolio:latest
docker run -d -p 80:80 your-username/portfolio:latest
```

### AWS ECS

1. Create ECR repository
2. Push image to ECR
3. Create ECS task definition
4. Deploy to ECS cluster

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/portfolio

# Deploy
gcloud run deploy portfolio \
  --image gcr.io/PROJECT-ID/portfolio \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

1. Connect your GitHub repo
2. Select Dockerfile
3. Deploy automatically

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8080

# Or use a different port
docker run -d -p 3000:80 --name portfolio portfolio-landing
```

### Image Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker build --no-cache -t portfolio-landing .
```

### Container Won't Start

```bash
# Check logs
docker logs portfolio

# Remove and recreate
docker rm -f portfolio
docker run -d -p 8080:80 --name portfolio portfolio-landing
```

### Update Files Without Rebuilding

```bash
# Copy file into running container
docker cp index.html portfolio:/usr/share/nginx/html/

# Restart nginx
docker exec portfolio nginx -s reload
```

---

## 📊 Image Info

### View Image Size

```bash
docker images portfolio-landing
```

### Inspect Image

```bash
docker inspect portfolio-landing
```

### View Image History

```bash
docker history portfolio-landing
```

---

## 🧹 Cleanup

### Remove Container and Image

```bash
docker rm -f portfolio
docker rmi portfolio-landing
```

### Clean All Unused Docker Resources

```bash
docker system prune -a --volumes
```

---

## 🔐 Security Best Practices

1. **Don't expose unnecessary ports**
2. **Use specific nginx version tags** instead of `:alpine`
3. **Scan image for vulnerabilities:**
   ```bash
   docker scan portfolio-landing
   ```
4. **Run as non-root user** (add to Dockerfile):
   ```dockerfile
   RUN adduser -D -g '' nginx-user
   USER nginx-user
   ```

---

## 📈 Performance Optimization

### Reduce Image Size

- Image uses `nginx:alpine` (~23MB base)
- Total image size: ~25-30MB
- Already optimized with gzip compression
- Static assets cached for 1 year

### Monitor Container

```bash
# Resource usage
docker stats portfolio

# Processes
docker top portfolio
```

---

## 🌍 Environment Variables (Optional)

If you want to make configurations dynamic:

```bash
docker run -d \
  -p 8080:80 \
  -e SITE_TITLE="My Portfolio" \
  --name portfolio \
  portfolio-landing
```

Then modify nginx.conf or index.html to use environment variables.
