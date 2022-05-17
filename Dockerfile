FROM node:latest as build

WORKDIR /src
COPY . .
RUN npm install
RUN npm run build


FROM nginx:latest

COPY --from=build /src/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf
