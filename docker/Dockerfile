FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration api

FROM node:22-alpine AS api
WORKDIR /data
RUN npm install --global json-server@1.0.0-beta.15
EXPOSE 3000
CMD ["json-server", "/data/db.json", "--host", "0.0.0.0", "--port", "3000"]

FROM nginx:1.27-alpine AS app
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/challenge-heroes/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
