import { Context } from "koa";
import { getManager } from "typeorm";
import { Client } from "../entity/Client.entity";

export class ClientController {
  constructor() {
    throw 'Class cant have any instance';
  }

  static async getAll(ctx: Context) {
    const repo = getManager().getRepository(Client);
    const clients = await repo.find();

    ctx.body = clients;
  }

  static async getById(ctx: Context) {
    const repo = getManager().getRepository(Client);
    const client = await repo.findOne({id: ctx.params.id});

    if (!client) {
      ctx.status = 404;
      return;
    }

    ctx.body = client;
  }

  static async save(ctx: Context) {
    const repo = getManager().getRepository(Client);
    const newClient = repo.create((ctx as any).request.body as Client);            

    await repo.save(newClient);

    ctx.body = newClient;
  }

  static async update(ctx: Context) {
    const repo = getManager().getRepository(Client);

    const res = await repo.createQueryBuilder()
      .update()
      .set((ctx.request as any).body)
      .where("id = :id", {id: ctx.params.id})
      .execute();

    if (!res.affected) {
      ctx.status = 404;
      return;
    }

    const client = await repo.findOne({id: ctx.params.id});

    ctx.body = client;
  }
}
