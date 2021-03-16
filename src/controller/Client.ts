import { Context } from "koa";
import { 
  getManager,
  FindManyOptions, 
  FindConditions, 
  Like, MoreThan, LessThan, Between
} from "typeorm";

import { Client } from "../entity/Client.entity";

import * as fs from 'fs';
import * as path from 'path';
import { ClientFile } from "../entity/ClientFile.entity";


export class ClientController {
  constructor() {
    throw 'Class cant have any instance';
  }

  static async getAll(ctx: Context) {
    const repo = getManager().getRepository(Client);

    const query = (ctx.request as any).query;

    let findOptions: FindManyOptions<Client> = {};
    // search by name
    if (query.name) {
      findOptions = ClientController.getFastSearchOptionsByName(query.name);
    } else {
      findOptions = ClientController.getAdvancesSearchOptions(query);
    }

    const clients = await repo.find(findOptions);

    ctx.body = clients;
  }

  private static getFastSearchOptionsByName(name: string): FindManyOptions<Client> {
    let findOptions: FindManyOptions<Client> = {};

    let nameParts = name.split(' ');
    if (nameParts.length == 1) {
      findOptions.where = [
        { firstName: Like(`%${name}%`) },
        { lastName: Like(`%${name}%`) }
      ];
    } else if (nameParts.length > 1) {
      findOptions.where = {
        firstName: Like(`%${nameParts[0]}%`),
        lastName: Like(`%${nameParts[1]}%`),
      }
    }

    return findOptions;
  }

  private static getAdvancesSearchOptions(query): FindManyOptions<Client> {    
    let where: FindConditions<Client>[] | FindConditions<Client> = {}

    for (let key in query) {
      switch (key) {
        case 'birthDateFrom':        
        case 'birthDateTo':
          break;

        default: 
          if (query[key]) {
            where[key] = query[key];
          }          
          break;
      }
    }

    if (query.birthDateFrom && !query.birthDateTo) {
      where.birthDate = MoreThan(query.birthDateFrom);
    } else if (query.birthDateTo && !query.birthDateFrom) {
      where.birthDate = LessThan(query.birthDateTo);
    } else if (query.birthDateFrom && query.birthDateTo) {
      where.birthDate = Between(query.birthDateFrom, query.birthDateTo);
    }

    return {where};
  }

  static async getById(ctx: Context) {
    const repo = getManager().getRepository(Client);
    const client = await repo.findOne({ id: ctx.params.id }, {
      relations: ['files']
    });

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
      .where("id = :id", { id: ctx.params.id })
      .execute();

    if (!res.affected) {
      ctx.status = 404;
      return;
    }

    const client = await repo.findOne({ id: ctx.params.id });

    ctx.body = client;
  }

  static async delete(ctx: Context) {
    const repo = getManager().getRepository(Client);

    await repo.delete((ctx.request as any).params.id);

    ctx.status = 204;    
  }

  static async saveFile(ctx: Context) {
    const clientId = (ctx.request as any).params.id;
    const uploadsPath = path.resolve(__dirname, '../uploads');
    const userDir = path.resolve(uploadsPath, clientId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    const file = (ctx.request as any).file;

    let allowedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/pdf': true
    }

    if (!allowedTypes[file.mimetype]) {
      ctx.status = 409;
      return
    }

    fs.writeFileSync(path.resolve(userDir, file.originalname), file.buffer);

    const repo = getManager().getRepository(ClientFile);
    const newFile = repo.create({
      client: clientId,
      mime: file.mimetype,
      fileName: file.originalname,
      originalName: file.originalname,
      size: file.size
    });

    await repo.save(newFile);
    const clientRepo = getManager().getRepository(Client);
    const client = await clientRepo.findOne({ id: clientId }, {
      relations: ['files']
    });

    ctx.body = client;
  }
}
