# EC2 Quick Deploy

Simple steps to deploy your portfolio on AWS EC2.

## Prerequisites

- EC2 instance running (t2.micro recommended)
- SSH key (.pem file)
- Security group allowing ports 22, 80, 443

## Deploy in 3 Steps

### 1. Transfer Files to EC2

```bash
# On your Mac
cd /Users/1065343/portfolio-landing

# Create tarball (excludes unnecessary files automatically)
tar -czf portfolio.tar.gz .

# Copy to EC2
scp -i /path/to/key.pem portfolio.tar.gz ec2-user@YOUR_EC2_IP:~/
```

### 2. SSH and Extract

```bash
# Connect to EC2
ssh -i /path/to/key.pem ec2-user@YOUR_EC2_IP

# Extract files
tar -xzf portfolio.tar.gz
chmod +x deploy-ec2.sh build.sh
```

### 3. Deploy

```bash
# Run deployment script
./deploy-ec2.sh
```

That's it! The script will:
- Install Docker if needed
- Build the image
- Run the container on port 80
- Show you the URL

## Connect Your Domain

**In GoDaddy DNS:**

| Type | Name | Value          |
|------|------|----------------|
| A    | @    | YOUR_EC2_IP    |
| A    | www  | YOUR_EC2_IP    |

Wait 10-30 minutes, then visit your domain.

## Image Size

Expected Docker image size: **~32-35MB**
- nginx:alpine base: ~23MB
- Your files: ~10MB
- Total: Very efficient!

## Add SSL (Optional)

```bash
# On EC2
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx config to use SSL
# See EC2-DEPLOY.md for full SSL setup
```

## Useful Commands

```bash
# View logs
docker logs -f portfolio-container

# Restart
docker restart portfolio-container

# Stop
docker stop portfolio-container

# Rebuild and redeploy
./deploy-ec2.sh

# Check status
docker ps

# Remove everything and start fresh
docker rm -f portfolio-container
docker rmi portfolio-landing:latest
./deploy-ec2.sh
```

## Troubleshooting

**Port 80 in use:**
```bash
sudo lsof -i :80
sudo kill -9 PID
./deploy-ec2.sh
```

**Can't access from browser:**
- Check security group allows port 80 from 0.0.0.0/0
- Verify container is running: `docker ps`
- Check logs: `docker logs portfolio-container`

**Image too large:**
Your images in Assets/ are ~10MB total. To reduce:
```bash
# Compress images (requires imagemagick)
sudo yum install ImageMagick -y  # Amazon Linux
for img in Assets/images/*.jpg Assets/images/*.png; do
  convert "$img" -quality 85 -resize 1200x1200\> "$img"
done
```

## Cost Estimate

- **t2.micro**: Free tier eligible (12 months)
- **Elastic IP**: Free while instance running
- **Monthly**: $0 (free tier) or ~$8.50 after

Stop instance when not needed:
```bash
aws ec2 stop-instances --instance-ids i-xxxxx
```

## Next Steps

- Set up automatic SSL renewal with cron
- Add CloudWatch monitoring
- Configure automatic backups
- Set up CI/CD with GitHub Actions

For detailed instructions, see EC2-DEPLOY.md
