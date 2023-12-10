FROM node:20-alpine as builder

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY web/package.json yarn.lock ./

RUN yarn -w --production=false

COPY web ./
RUN yarn build

FROM nginx:alpine

EXPOSE 80
WORKDIR /app

COPY .deploy/client.nginx.conf /etc/nginx/conf.d/default.conf
COPY web/public /app/public
COPY --from=builder /app/dist/bundle /app
