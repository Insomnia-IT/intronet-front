import { checkWriteAccess } from "./auth";
import { authCtrl, UserInfo } from "./auth.ctrl";
import Fastify from "fastify";
import { importMainPage } from "./data/import";
import { importActivities } from "./data/importActivities";
import { importLocations } from "./data/importLocations";
import { importMovies } from "./data/importMovies";
import { importShops } from "./data/importShops";
import { dbCtrl } from "./db-ctrl";
import { logCtrl } from "./log.ctrl";
import { getResults, vote } from "./vote.ctrl";
import * as console from "console";
import { importVurchel } from "./data/importVurchel";

const fastify = Fastify({
  logger: false,
});

// Declare a route
fastify.get("/versions", async function (request, reply) {
  return dbCtrl.getVersions();
});
fastify.get("/auth", async function (request, reply) {
  console.log(request.headers.authorization);
  return (await authCtrl.parse(request.headers.authorization)).role;
});
fastify.post("/auth/token", async function (request, reply) {
  const user = await authCtrl.parse(request.headers.authorization);
  if (user.role !== "superadmin") {
    reply.status(401);
    return `Only superadmin can create tokens`;
  }
  return authCtrl.create(JSON.parse(request.body as string));
});
fastify.post("/log", async function (request, reply) {
  logData = {
    ...JSON.parse(request.body as string),
    app: "client",
  };
  reply.status(205);
});

fastify.get("/vote", async function (request, reply) {
  const user = await authCtrl.parse(request.headers.authorization);
  if (user.role !== "superadmin") {
    reply.status(401);
    return `Only superadmin can see voting results`;
  }
  const results = await getResults();
  console.log(results);
  return results;
});

fastify.post("/vote", async function (request, reply) {
  const id = JSON.parse(request.body as string).id;
  logData = {
    id,
    action: "vote",
    app: "client",
  };
  vote({
    id,
    uid: request.headers.uid as string,
    ip: request.headers["x-forwarded-for"] as string,
  });
});
fastify.get<{
  Params: { name: string };
  Querystring: { since?: string };
}>("/data/:name", async function (request, reply) {
  const items = await dbCtrl.get(request.params.name, request.query.since);
  const user = await authCtrl
    .parse(request.headers.authorization)
    .catch(() => null);
  if (user) return items;
  return items.filter((x) => x.isApproved !== false);
});

fastify.post<{ Params: { name: string } }>(
  "/data/:name",
  async function (request, reply) {
    const value = JSON.parse(request.body as string);
    const user = await authCtrl
      .parse(request.headers.authorization)
      .catch(() => null);
    if (!checkWriteAccess(user, request.params.name, value)) {
      reply.status(401);
      return `User have not enough permissions to modify db`;
    }
    return await dbCtrl.addOrUpdate(request.params.name, value);
  }
);
fastify.post("/batch", async function (request, reply) {
  const user = await authCtrl
    .parse(request.headers.authorization)
    .catch(() => null);
  const data = JSON.parse(request.body as string) as Array<{
    db: string;
    value: any;
  }>;
  console.log("batch", data);
  for (let item of data) {
    if (!checkWriteAccess(user, item.db, item.value)) continue;
    await dbCtrl.addOrUpdate(item.db, item.value);
  }
});
fastify.post<{ Params: { name: string }; Querystring: { force: boolean } }>(
  "/seed/:name",
  async function (request, reply) {
    // return `Seed is temporary disabled: production`;
    const user = await authCtrl.parse(request.headers.authorization);
    if (user.role !== "superadmin") {
      reply.status(401);
      return `User have not enough permissions to modify db`;
    }
    switch (request.params.name) {
      // disabled!!! admin only editing
      case "locations":
        return importLocations(request.query.force);
      case "vurchel":
        return importVurchel(request.query.force);
      case "movies":
        return importMovies(request.query.force);
      case "activities":
        return importActivities(request.query.force);
      case "main":
        return importMainPage(request.query.force);
      case "shops":
        return importShops(request.query.force);
    }
  }
);

// Run the server!
fastify.listen(
  { port: +(process.env.PORT ?? 5005), host: process.env.HOST },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
  }
);

let user: UserInfo;
fastify.addHook("onRequest", async (request, reply) => {
  if (request.headers.authorization) {
    try {
      user = await authCtrl.parse(request.headers.authorization);
    } catch (e) {}
  }
});
let logData = {};

const logHook = async (request, reply) => {
  if (request.routerPath == "/versions") return;
  // Some code
  await logCtrl.log({
    method: request.method,
    path: request.routerPath,
    params: request.params,
    statusCode: reply.statusCode,
    user: user,
    headers: request.headers,
    uid: request.headers.uid,
    ip: request.headers["x-forwarded-for"],
    query: request.query,
    time: reply.getResponseTime(),
    app: "server",
    ...logData,
  });
};

fastify.addHook("onResponse", logHook);
fastify.addHook("onError", logHook);
