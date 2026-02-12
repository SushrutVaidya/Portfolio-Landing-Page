# Portfolio Landing Page

A lightweight portfolio site with a Netflix-inspired intro animation and scrolling film reels.

## Stack

- Vanilla HTML/CSS/JavaScript
- Nginx (Docker deployment)
- No frameworks, no build tools

## Features

- Netflix-style name reveal animation
- Dual scrolling film reels (developer memes)
- Social links and resume download
- Fully responsive
- Sub-30MB Docker image

## Quick Start

Local development:

```bash
python3 -m http.server 8000
```

Docker deployment:

```bash
docker build -t portfolio .
docker run -d -p 8080:80 portfolio
```

Or use the included script:

```bash
./start.sh
```

## Project Structure

```
.
├── index.html              # main page
├── index.css               # styles
├── index.js                # animations and interactions
├── shared/
│   ├── design-system.css   # design tokens
│   ├── components.css      # reusable components
│   └── animations.js       # animation utilities
├── Assets/
│   ├── images/             # film reel images
│   ├── audio/              # optional sound effect
│   └── resume/             # PDF download
└── Dockerfile
```

## Customization

Update personal info in `index.html`:

- Line 67: GitHub URL
- Line 81: LinkedIn URL
- Line 95: Steam profile
- Line 140: Phone number
- Line 147: Email

Add your resume PDF:

```bash
cp ~/path/to/resume.pdf Assets/resume/Resume.pdf
```

Adjust film reel dimensions in `index.css`:

- Line 199: Container width
- Lines 235-236: Frame size
- Line 222: Spacing between frames

## Performance

- Nginx with gzip compression
- One-year cache for static assets
- Lazy loading for images
- CSS transforms for 60fps animations

## Deployment

Works on any static host:

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# AWS S3
aws s3 sync . s3://bucket-name --exclude ".git/*"
```

Docker registries:

```bash
docker tag portfolio username/portfolio
docker push username/portfolio
```

## Browser Support

Chrome 60+, Firefox 60+, Safari 12+, Edge 79+

