FROM node:18.16-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:18.16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY package*.json .
CMD ["yarn", "start:prod"]
