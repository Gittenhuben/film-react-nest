FROM nginx
WORKDIR /app/frontend-dist

COPY nginx.conf /etc/nginx/nginx.conf
COPY server.conf /etc/nginx/conf.d/server.conf

EXPOSE 80 8080
CMD ["nginx", "-g", "daemon off;"]
