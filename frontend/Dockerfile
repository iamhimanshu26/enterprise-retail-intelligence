# Frontend - Multi-stage production build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:8080
ARG VITE_DATA_SERVICE_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DATA_SERVICE_URL=$VITE_DATA_SERVICE_URL

RUN npm run build

# Production stage with nginx
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
