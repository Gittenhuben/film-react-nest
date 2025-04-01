FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS backend-production
WORKDIR /app
COPY --from=backend-builder /app/package*.json .
RUN npm ci --omit=dev
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/public ./public
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
