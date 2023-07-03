FROM node:18-alpine as builder

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY . ./
RUN yarn build

FROM nginx:alpine

EXPOSE 80
WORKDIR /app

COPY --from=builder /app/dist/bundle /app
