FROM node:18-alpine as builder

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY ./ ./
RUN npx cmmn compile


FROM node:18-alpine

COPY --from=builder /app /app

EXPOSE 80
WORKDIR /app

CMD ["node", "/app/dist/esm/index.js"]
