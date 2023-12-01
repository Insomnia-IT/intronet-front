FROM node:20-alpine as builder

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY . ./
RUN yarn build


FROM node:20-alpine as library

WORKDIR /app
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn --production=true --frozen-lockfile

FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY ./server/package.json yarn.lock ./

COPY --from=library /app/node_modules /app/node_modules
COPY --from=builder /app/dist/esm /app/dist/esm

EXPOSE 80

CMD ["node", "/app/dist/esm/server/index.js"]
