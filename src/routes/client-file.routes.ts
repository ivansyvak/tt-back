import { ClientFileController } from "../controller/ClientFile";

export const ClientFileRoutes = [
  {
    path: '/clients-files',
    method: 'get',
    action: ClientFileController.getAll
  },
  {
    path: '/clients-files/:id',
    method: 'get',
    action: ClientFileController.getById
  },
  {
    path: '/clients-files',
    method: 'post',
    action: ClientFileController.save
  }
];
