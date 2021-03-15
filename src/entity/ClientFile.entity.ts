import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client.entity";

@Entity({name: 'client_files'})
export class ClientFile {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 256})
  fileName: string;

  @Column({type: 'varchar', length: 256})
  originalName: string;

  @Column({type: 'varchar', length: 10})
  mime: 'image/png' | 'image/jpeg' | 'image/pdf';

  // 10485760 Byte
  @Column({type: 'int'})
  size: number;

  @ManyToOne(type => Client, client => client.files)
  client: Client;
}

