import { ClientController } from "../controller/Client";

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
  }
];
