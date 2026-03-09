import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class EnderecoEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    logradouro: string;
    @Column()
    numero: string;
    @Column()
    cidade: string;
    @Column()
    estado: string;
    @Column()
    cep: string;
    @Column({ nullable: true })
    complemento?: string;

    constructor(logradouro: string, numero: string, cidade: string, estado: string, cep: string, complemento?: string) {
        this.logradouro = logradouro;
        this.numero = numero;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.complemento = complemento;
    }
}