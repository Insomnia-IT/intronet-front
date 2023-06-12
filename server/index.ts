import * as console from "console";
import {checkAccess} from "./auth";
import {authCtrl, UserInfo} from "./auth.ctrl";
import Fastify from "fastify";
import { dbCtrl } from "./db-ctrl";
import {logCtrl} from "./log.ctrl";
const fastify = Fastify({
  logger: false
});

// Declare a route
fastify.get("/versions", async function (request, reply) {
  return dbCtrl.getVersions();
});
fastify.get("/auth", async function (request, reply) {
  console.log(request.headers.authorization)
  return (await authCtrl.parse(request.headers.authorization)).role;
});
fastify.post("/auth/token", async function (request, reply) {
  const user = await authCtrl.parse(request.headers.authorization);
  if (user.role !== "superadmin"){
    reply.status(401);
    return `Only superadmin can create tokens`;
  }
  return authCtrl.create(JSON.parse(request.body as string));
});
fastify.post("/log", async function (request, reply) {
  logData = {
    ...JSON.parse(request.body as string),
    app: 'client',
  };
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
    if (request.params.name !=='notes') {
      const user = await authCtrl.parse(request.headers.authorization);
      if (!checkAccess(user, request.params.name)) {
        reply.status(401);
        return `User have not enough permissions to modify db`;
      }
    }
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
  for (let item of data) {
    if (!checkAccess(user, item.db))
      continue;
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

let user: UserInfo;
fastify.addHook('onRequest', async (request, reply) => {
  if (request.headers.authorization){
    user = await authCtrl.parse(request.headers.authorization);
  }
})
let logData = {};

const logHook = async (request, reply) => {
  // Some code
  await logCtrl.log({
    method: request.method,
    path: request.routerPath,
    params: request.params,
    statusCode: reply.statusCode,
    user: user,
    uid: request.headers.uid,
    ip: request.ip,
    query: request.query,
    time: reply.getResponseTime(),
    app: 'server',
    ...logData
  })
}

fastify.addHook('onResponse', logHook);
fastify.addHook('onError', logHook);
