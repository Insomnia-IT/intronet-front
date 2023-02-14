FROM node:18-alpine as builder

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/node_modules/.cache \
    yarn --production=false --frozen-lockfile

COPY ./ ./
RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/node_modules/.cache \
    yarn build

#RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
#    yarn --production=true --frozen-lockfile

#RUN /usr/local/bin/node-clean


FROM nginx:alpine

EXPOSE 80
WORKDIR /app

COPY --from=builder /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf
