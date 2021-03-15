import "reflect-metadata";

import * as Koa from 'koa';
import * as Router from 'koa-router';

import * as bodyParser from "koa-bodyparser";
import * as cors from '@koa/cors';

import { createConnection } from "typeorm";
import { AppRoutes } from "./routes";

createConnection().then(async connection => {
  await connection.synchronize();  

  const app = new Koa();
  const router = new Router();

  AppRoutes.forEach(route => router[route.method](route.path, route.action));

  // run app
  app.use(cors());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3000);
  
}).catch(console.log);

// router.get('/', async(ctx, next) => {
//   ctx.body = {msg: 'Hello world!!!'};

//   await next();
// });

// app.use(json());

// app.use(router.routes())
//   .use(router.allowedMethods());

// app.listen(3000, () => {
//   console.log('server listening on port 3000');
// });
