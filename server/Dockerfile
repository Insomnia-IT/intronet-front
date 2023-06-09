FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY ./ ./
RUN npx cmmn compile

FROM node:18-alpine as library

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --production=true --frozen-lockfile

FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock ./

COPY --from=library /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 80

CMD ["node", "/app/dist/esm/index.js"]
