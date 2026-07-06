# Use the official, lightweight Nginx image based on Alpine Linux
FROM nginx:alpine

# Copy our index.html file into the default Nginx public HTML directory
COPY index.html /usr/share/nginx/html/

# Expose port 80 to tell Docker that the container listens on this port
EXPOSE 80

# Start Nginx in the foreground (daemon off) so the container doesn't exit immediately
CMD ["nginx", "-g", "daemon off;"]