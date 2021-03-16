import * as multer from '@koa/multer'

import { ClientController } from "../controller/Client";

const upload: any = multer();

export const ClientRoutes = [
  {
    path: '/clients',
    method: 'get',
    action: ClientController.getAll
  },
  {
    path: '/clients/:id',
    method: 'get',
    action: ClientController.getById
  },
  {
    path: '/clients',
    method: 'post',
    action: ClientController.save
  },
  {
    path: '/clients/:id',
    method: 'put',
    action: ClientController.update
  },
  // {
  //   path: '/clients/:id/files',
  //   method: 'post',
  //   middleware: upload.single('clientFile'),
  //   action: ClientController.saveFile
  // },
  {
    path: '/clients/:id',
    method: 'delete',
    action: ClientController.delete
  }
];
