import { Repository } from "typeorm";
import AdotanteEntity from "../entities/AdotanteEntity";
import EnderecoEntity from "../entities/EnderecoEntity";
import InterfaceAdotanteRepository from "./interfaces/InterfaceAdotanteRepository";
import { NaoEncontrado, RequisicaoRuim } from "../utils/manipulaErros";


export default class AdotanteRepository implements InterfaceAdotanteRepository {
  constructor(private repository: Repository<AdotanteEntity>) {}

  private async verificaCelularUnico(celular: string){
   return await this.repository.findOne({ where: { celular } });
  }

  private async verificaEmailUnico(email: string){
   return await this.repository.findOne({ where: { email } });
  }

  private async verificaCpfUnico(cpf: string){
    return await this.repository.findOne({ where: { cpf } });
  }

  async criaAdotante(adotante: AdotanteEntity): Promise<void> {
    if (await this.verificaCelularUnico(adotante.celular)) {
      throw new RequisicaoRuim("Celular já cadastrado");
    }

    if (await this.verificaEmailUnico(adotante.email)) {
      throw new RequisicaoRuim("Email já cadastrado");
    }

    if (await this.verificaCpfUnico(adotante.cpf)) {
      throw new RequisicaoRuim("CPF já cadastrado");
    }

    await this.repository.save(adotante);
  }
  async listaAdotantes(): Promise<AdotanteEntity[]> {
    return await this.repository.find();
  }
  async atualizaAdotante(
    id: number,
    newData: AdotanteEntity
  ): Promise<{ success: boolean; message?: string }> {
    const adotanteToUpdate = await this.repository.findOne({ where: { id } });

      if (!adotanteToUpdate) {
        throw new NaoEncontrado("Adotante não encontrado");
      }

      Object.assign(adotanteToUpdate, newData);

      await this.repository.save(adotanteToUpdate);

      return { success: true };
  }

  async deletaAdotante(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    const adotanteToRemove = await this.repository.findOne({ where: { id } });

      if (!adotanteToRemove) {
        throw new NaoEncontrado("Adotante não encontrado");
      }

      await this.repository.remove(adotanteToRemove);
      return { success: true };
  }

  async atualizaEnderecoAdotante( idAdotante: number, endereco: EnderecoEntity):Promise<{ success: boolean; message?: string }> {
    const adotante = await this.repository.findOne({
      where: { id: idAdotante },
    });

    if (!adotante) {
      throw new NaoEncontrado("Adotante não encontrado");
    }

    const novoEndereco = new EnderecoEntity(endereco.logradouro, endereco.numero, endereco.cidade, endereco.estado, endereco.cep, endereco.complemento);
    adotante.endereco = novoEndereco;
    await this.repository.save(adotante);
    return { success: true };
  }
}
