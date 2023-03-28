FROM node:18-alpine

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY ./ ./
RUN npx tsc

EXPOSE 80

CMD ["node", "/app/dist/esm/index.js"]
