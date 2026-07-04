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

COPY web/public/fonts /app/public/fonts
COPY web/public/images /app/public/images
COPY web/public/icons /app/public/icons
COPY web/public/styles /app/public/styles
COPY .deploy/client.nginx.conf /etc/nginx/conf.d/default.conf
COPY web/public/manifest.json /app/public/manifest.json
COPY --from=builder /app/dist/bundle /app
COPY web/public/root.version /app/public/root.version
