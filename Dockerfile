# Portfolio Landing Page - Optimized for Small Size
FROM nginx:alpine

# Remove default nginx files and copy custom config in one layer
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files
COPY index.html index.css index.js /usr/share/nginx/html/
COPY shared/ /usr/share/nginx/html/shared/
COPY Assets/ /usr/share/nginx/html/Assets/

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

