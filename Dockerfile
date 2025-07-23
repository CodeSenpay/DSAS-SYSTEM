# Build stage: Vite frontend
FROM node:20-alpine AS build
WORKDIR /DSAS-SYSTEM
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage: serve static files with non-root Nginx
FROM nginxinc/nginx-unprivileged:stable-alpine

# Copy built assets
COPY --from=build /DSAS-SYSTEM/dist /usr/share/nginx/html

# Add your custom Nginx config
COPY nginx-webapp.conf /etc/nginx/conf.d/default.conf

# Expose non-root port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
