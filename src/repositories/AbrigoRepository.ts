import { Repository } from "typeorm";
import AbrigoEntity from "../entities/AbrigoEntity";
import EnderecoEntity from "../entities/EnderecoEntity";
import InterfaceAbrigoRepository from "./interfaces/interfaceAbrigoRepository";
import { NaoEncontrado, RequisicaoRuim } from "../utils/manipulaErros";


export default class AbrigoRepository implements InterfaceAbrigoRepository {
  constructor(private repository: Repository<AbrigoEntity>) {}

  private async verificaCelularUnico(celular: string){
   return await this.repository.findOne({ where: { celular } });
  }

  private async verificaEmailUnico(email: string){
   return await this.repository.findOne({ where: { email } });
  }

  private async verificaCnpjUnico(cnpj: string){
    return await this.repository.findOne({ where: { cnpj } });
  }

  async criaAbrigo(abrigo: AbrigoEntity): Promise<void> {
    if (await this.verificaCelularUnico(abrigo.celular)) {
      throw new RequisicaoRuim("Celular já cadastrado");
    }

    if (await this.verificaEmailUnico(abrigo.email)) {
      throw new RequisicaoRuim("Email já cadastrado");
    }

    if (await this.verificaCnpjUnico(abrigo.cnpj)) {
      throw new RequisicaoRuim("CNPJ já cadastrado");
    }

    await this.repository.save(abrigo);
  }
  async listaAbrigos(): Promise<AbrigoEntity[]> {
    return await this.repository.find();
  }
  async atualizaAbrigo(
    id: number,
    newData: AbrigoEntity
  ): Promise<{ success: boolean; message?: string }> {
    const abrigoToUpdate = await this.repository.findOne({ where: { id } });

      if (!abrigoToUpdate) {
        throw new NaoEncontrado("Abrigo não encontrado");
      }

      Object.assign(abrigoToUpdate, newData);
      await this.repository.save(abrigoToUpdate);
      return { success: true };
  }

  async deletaAbrigo(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    const abrigoToRemove = await this.repository.findOne({ where: { id } });

      if (!abrigoToRemove) {
        throw new NaoEncontrado("Abrigo não encontrado");
      }

      await this.repository.remove(abrigoToRemove);
      return { success: true };
  }

  async atualizaEnderecoAbrigo( idAbrigo: number, endereco: EnderecoEntity):Promise<{ success: boolean; message?: string }> {
    const abrigo = await this.repository.findOne({
      where: { id: idAbrigo },
    });

    if (!abrigo) {
      throw new NaoEncontrado("Abrigo não encontrado");
    }

    const novoEndereco = new EnderecoEntity(endereco.logradouro, endereco.numero, endereco.cidade, endereco.estado, endereco.cep, endereco.complemento);
    abrigo.endereco = novoEndereco;
    await this.repository.save(abrigo);
    return { success: true };
  }
}
