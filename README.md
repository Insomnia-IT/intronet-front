# Insomnia Intronet Frontend

Web framework for building fast web application with business logic dedicated in a worker, simple CustomElements with uhtml, DI and data flow via cellx.

[WIP]

prod: https://intro.cherepusick.keenetic.name

build: 
  `npm run ci`
   собирает docker image `insomnia/intronet-front` 

запуск: docker-compose

## dev

* `npm run ci` - make docker production image
* `docker compose up -d` - start local production server on :8092
* `npm run run` - serve dev version with auto refresh on :5001 with db proxy to :8092
* или `npm run compile`, `npm run bundle:watch`, `npm run serve` - same but in different processes

