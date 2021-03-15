import { Context } from "koa";
import { getManager } from "typeorm"
import { ClientFile } from "../entity/ClientFile.entity";

export class ClientFileController {
  constructor() {
    throw 'Class cant have any instance';
  }

  static async getAll(ctx: Context) {
    const repo = getManager().getRepository(ClientFile);
    const clientFiles = await repo.find();

    ctx.body = clientFiles;
  }

  static async getById(ctx: Context) {
    const repo = getManager().getRepository(ClientFile);
    const clientFile = await repo.findOne({id: ctx.params.id});

    if (!clientFile) {
      ctx.status = 404;
      return;
    }

    ctx.body = clientFile;
  }

  static async save(ctx: Context) {
    const repo = getManager().getRepository(ClientFile);
    const newClientFile = repo.create((ctx as any).request.body);

    await repo.save(newClientFile);

    ctx.body = newClientFile;
  }

  static async update(ctx: Context) {
    
  }
}
