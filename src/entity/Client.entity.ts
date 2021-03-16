import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientFile } from "./ClientFile.entity";

@Entity({name: 'clients'})
export class Client {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 32})
  firstName: string;

  @Column({type: 'varchar', length: 32})
  lastName: string;

  @Column({type: 'varchar', length: 128, default: ''})
  email: string;

  @Column({type: 'date', default: '1900-01-01'})
  birthDate: Date;

  // @Column({type: 'timestamp', default: 'CURRENT_TIMESTAMP'})
  @CreateDateColumn()
  registrationDate: Date;

  @Column({type: 'varchar', length: 15, default: ''})
  ipAddress: string;

  @Column({type: 'varchar', length: 6})
  status: 'lead' | 'demo' | 'client';

  @OneToMany(type => ClientFile, file => file.client)
  files: ClientFile[];
}

