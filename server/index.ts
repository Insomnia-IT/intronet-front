import { authCtrl } from "./auth.ctrl";
import Fastify from "fastify";
import { dbCtrl } from "./db-ctrl";
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/versions", async function (request, reply) {
  return dbCtrl.getVersions();
});
fastify.get("/auth", async function (request, reply) {
  return await authCtrl.check(request.headers.authorization);
});
fastify.get<{
  Params: { name: string };
  Querystring: { since?: string };
}>("/data/:name", async function (request, reply) {
  console.log(request.query.since);
  return await dbCtrl.get(request.params.name, request.query.since);
});

fastify.post<{ Params: { name: string } }>(
  "/data/:name",
  async function (request, reply) {
    await authCtrl.check(request.headers.cookie);
    return await dbCtrl.addOrUpdate(
      request.params.name,
      JSON.parse(request.body as string)
    );
  }
);
fastify.post("/batch", async function (request, reply) {
  const data = JSON.parse(request.body as string) as Array<{
    db: string;
    value: any;
  }>;
  await authCtrl.check(request.headers.cookie);
  for (let item of data) {
    await dbCtrl.addOrUpdate(item.db, item.value);
  }
});

// Run the server!
fastify.listen(
  { port: +(process.env.PORT ?? 5002), host: process.env.HOST },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  }
);
