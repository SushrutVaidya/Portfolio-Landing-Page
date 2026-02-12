# EC2 Deployment Guide

Complete guide for deploying this portfolio on AWS EC2 with Docker.

## Prerequisites

- AWS account
- EC2 key pair (.pem file)
- Domain name (optional, but needed for SSL)

## Step 1: Launch EC2 Instance

**Via AWS Console:**
1. Go to EC2 Dashboard
2. Click **Launch Instance**
3. Select **Amazon Linux 2023** or **Ubuntu 22.04**
4. Instance type: **t2.micro** (free tier)
5. Create or select existing key pair
6. Configure security group (see below)
7. Storage: 8GB (default)
8. Launch instance

**Security Group Rules:**
- SSH (22) - Your IP only
- HTTP (80) - 0.0.0.0/0
- HTTPS (443) - 0.0.0.0/0

## Step 2: Allocate Elastic IP

1. EC2 → **Elastic IPs** → **Allocate Elastic IP**
2. Select the new IP → **Actions** → **Associate**
3. Select your instance → **Associate**

This prevents your IP from changing on restart.

## Step 3: Connect to EC2

```bash
chmod 400 /path/to/your-key.pem
ssh -i /path/to/your-key.pem ec2-user@YOUR_ELASTIC_IP
```

For Ubuntu: `ubuntu@YOUR_ELASTIC_IP`

## Step 4: Install Docker

**Amazon Linux 2023:**
```bash
sudo yum update -y
sudo yum install docker git -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
exit  # logout and login again
```

**Ubuntu 22.04:**
```bash
sudo apt update
sudo apt install docker.io git -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
exit  # logout and login again
```

## Step 5: Deploy Application

**Option A: Transfer files from local**

On your Mac:
```bash
cd /Users/1065343/portfolio-landing
tar -czf portfolio.tar.gz .
scp -i /path/to/key.pem portfolio.tar.gz ec2-user@YOUR_IP:~/
```

On EC2:
```bash
tar -xzf portfolio.tar.gz
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

**Option B: Clone from GitHub**

On EC2:
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

## Step 6: Verify Deployment

```bash
# Check container is running
docker ps

# View logs
docker logs portfolio-container

# Test locally
curl http://localhost

# Test from outside
curl http://YOUR_ELASTIC_IP
```

Access in browser: `http://YOUR_ELASTIC_IP`

## Step 7: Connect Domain (GoDaddy)

1. Log into GoDaddy
2. Go to **My Products** → **Domains**
3. Select domain → **Manage DNS**
4. Edit/Add A records:

| Type | Name | Value              | TTL |
|------|------|--------------------|-----|
| A    | @    | YOUR_ELASTIC_IP    | 600 |
| A    | www  | YOUR_ELASTIC_IP    | 600 |

5. Save and wait 10-30 minutes for propagation

Verify:
```bash
dig +short yourdomain.com
```

## Step 8: Enable HTTPS with Let's Encrypt

**On EC2:**

```bash
# Stop Docker container
docker stop portfolio-container

# Install Certbot
sudo yum install certbot -y  # Amazon Linux
# OR
sudo apt install certbot -y  # Ubuntu

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Follow prompts, enter email

# Certificates saved at: /etc/letsencrypt/live/yourdomain.com/
```

**Update nginx config to use SSL:**

```bash
# Replace the default nginx config with SSL version
sudo cp nginx-ssl.conf nginx.conf

# Edit to replace yourdomain.com with your actual domain
sed -i 's/yourdomain.com/YOURDOMAIN.com/g' nginx.conf
```

**Rebuild and restart with SSL:**

```bash
./deploy-ec2.sh
```

The script will automatically detect SSL certificates and mount them.

**Access your site:**
- `https://yourdomain.com` - Secure HTTPS
- `http://yourdomain.com` - Redirects to HTTPS

## SSL Certificate Auto-Renewal

Certbot certificates expire in 90 days. Set up auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e

# Add this line (runs twice daily)
0 0,12 * * * certbot renew --quiet --post-hook "docker restart portfolio-container"
```

## Useful Commands

```bash
# View running containers
docker ps

# View logs
docker logs -f portfolio-container

# Restart container
docker restart portfolio-container

# Stop container
docker stop portfolio-container

# Remove container
docker rm portfolio-container

# Rebuild and deploy
./deploy-ec2.sh

# Check nginx config
docker exec portfolio-container nginx -t

# View disk usage
df -h

# View memory usage
free -h

# Check open ports
sudo netstat -tulpn | grep LISTEN
```

## Troubleshooting

### Port 80/443 already in use

```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Kill process if needed
sudo kill -9 PID
```

### Cannot connect to domain

```bash
# Check DNS propagation
dig yourdomain.com
nslookup yourdomain.com

# Check security group allows HTTP/HTTPS
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Check nginx is running
docker logs portfolio-container
```

### SSL certificate errors

```bash
# Verify certificates exist
sudo ls -la /etc/letsencrypt/live/yourdomain.com/

# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
docker restart portfolio-container
```

### Container won't start

```bash
# Check detailed logs
docker logs portfolio-container

# Check nginx config syntax
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:alpine nginx -t

# Rebuild image
docker build -t portfolio .
./deploy-ec2.sh
```

## Cost Estimation

**Monthly AWS Costs:**
- EC2 t2.micro: $0 (free tier) or ~$8.50/month
- Elastic IP: $0 (while associated)
- Data transfer: First 1GB free, then $0.09/GB
- EBS storage: $0.10/GB/month (8GB = $0.80)

**Total:** ~$0-10/month depending on traffic

## Stopping Instance to Save Money

```bash
# Stop instance when not needed
aws ec2 stop-instances --instance-ids i-xxxxx

# Start again when needed
aws ec2 start-instances --instance-ids i-xxxxx
```

Note: Elastic IP charges $0.005/hour when instance is stopped. Either start the instance or release the IP.

## Next Steps

- Set up CloudWatch monitoring
- Configure automatic backups
- Add CI/CD pipeline with GitHub Actions
- Set up application load balancer for high availability
- Configure Auto Scaling groups

## Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
