import "reflect-metadata";

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from "koa-bodyparser";
import * as koaBody from 'koa-body';
import * as cors from '@koa/cors';

import * as multer from '@koa/multer';

import { createConnection } from "typeorm";
import { AppRoutes } from "./routes";
import { ClientRoutes } from "./routes/client.routes";
import { ClientController } from "./controller/Client";

const upload: any = multer();

createConnection().then(async connection => {
  await connection.synchronize();  

  const app = new Koa();
  const router = new Router();

  AppRoutes.forEach(route => router[route.method](route.path, route.action));
  
  // забил хуй, много потратил времени. 
  // пускай этот роут будет здесь
  // трабл с upload.single('clientFile')
  router.post('/clients/:id/files', upload.single('clientFile'), ClientController.saveFile);

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
