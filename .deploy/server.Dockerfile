FROM node:20-alpine as builder

WORKDIR /app

COPY server/package.json ./

RUN yarn --production=false

COPY server ./
RUN yarn build


FROM node:20-alpine as library

WORKDIR /app
COPY ./server/package.json ./
RUN yarn --production=true

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY ./server/package.json ./

COPY --from=library /app/node_modules /node_modules
COPY --from=builder /app/dist/esm /app

EXPOSE 80

CMD ["node", "/app/index.js"]
