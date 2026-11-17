
FROM node:18-alpine AS build

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

RUN npm ci

# Copy Angular source code
COPY frontend/ ./

# Build Angular application
RUN npm run build

# Production web server
FROM nginx:alpine

COPY --from=build /app/dist/puff-sip/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
