FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json .
RUN npm ci
RUN npm i --save-dev rollup@4.18.0
COPY . .
RUN npm run build

FROM alpine
WORKDIR /app
COPY --from=frontend-builder /app/dist ./dist
CMD [ "sh", "-c", "rm -r -f frontend-dist/* ; cp -r dist/. frontend-dist/" ]
