import Fastify from 'fastify'
import {dbCtrl} from "./db-ctrl";
const fastify = Fastify({
  // logger: true
})

// Declare a route
fastify.get('/versions', async function (request, reply) {
  return dbCtrl.getVersions();
});

fastify.get<{
  Params: {name: string;};
  Querystring: {since?: string;};
}>('/data/:name', async function (request, reply) {
  return await dbCtrl.get(request.params.name, request.query.since);
});

fastify.post<{Params: {name: string;}}>('/data/:name', async function (request, reply) {
  return await dbCtrl.addOrUpdate(request.params.name, request.body);
});

// Run the server!
fastify.listen({ port: 5002 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
