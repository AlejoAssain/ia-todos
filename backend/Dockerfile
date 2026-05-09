FROM node:22.13-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22.13-bookworm-slim AS production-deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22.13-bookworm-slim

ENV NODE_ENV=production
ENV PORT=3000
ENV SQLITE_DATABASE=/app/data/prod.sqlite

WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
