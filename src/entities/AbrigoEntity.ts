import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import PetEntity from "./PetEntity";
import EnderecoEntity from "./EnderecoEntity";

@Entity()
export default class AbrigoEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    nome: string;
    @Column()
    email: string;
    @Column()
    celular: string;
    @Column()
    cnpj: string;
    @Column()
    senha: string;

    @OneToOne(() => EnderecoEntity, {
        nullable: true,
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    endereco?: EnderecoEntity;
    @OneToMany(() => PetEntity, (pet) => pet.abrigo)
    pets!: PetEntity[];

    constructor(
    nome: string,
    email: string,
    celular: string,
    cnpj: string,
    senha: string
  ) {
    this.nome = nome;
    this.email = email;
    this.celular = celular;
    this.cnpj = cnpj;
    this.senha = senha;
  }
}
