# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY client/ .
RUN npm install && npm run build

# Serve React build using nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
