import { Repository } from "typeorm";
import PetEntity from "../entities/PetEntity";
import InterfacePetRepository from "./interfaces/InterfacePetRepository";
import AdotanteEntity from "../entities/AdotanteEntity";
import { NaoEncontrado } from "../utils/manipulaErros"
import AbrigoEntity from "../entities/AbrigoEntity";

export default class PetRepository implements InterfacePetRepository {
  private petRepository: Repository<PetEntity>;
  private adotanteRepository: Repository<AdotanteEntity>;
  private abrigoRepository: Repository<AbrigoEntity>;

  constructor(
    petRepository: Repository<PetEntity>,
    adotanteRepository: Repository<AdotanteEntity>,
    abrigoRepository: Repository<AbrigoEntity>
  ) {
    this.petRepository = petRepository;
    this.adotanteRepository = adotanteRepository;
    this.abrigoRepository = abrigoRepository;
  }

  async criaPet(pet: PetEntity): Promise<void> {
    await this.petRepository.save(pet);
  }
  async listaPet(): Promise<PetEntity[]> {
    return await this.petRepository.find({relations: ["abrigo", "adotante"]});
  }
  async atualizaPet( id: number, newData: PetEntity ) {
    const petToUpdate = await this.petRepository.findOne({ where: { id } });

      if (!petToUpdate) {
        throw new NaoEncontrado("Pet não encontrado")
      }

      Object.assign(petToUpdate, newData);

      await this.petRepository.save(petToUpdate);

      return { success: true };
  }

  async deletaPet(id: number) {
      const petToRemove = await this.petRepository.findOne({ where: { id } });

      if (!petToRemove) {
        throw new NaoEncontrado("Pet não encontrado");
      }

      await this.petRepository.remove(petToRemove);

      return { success: true };
  }

  async adotaPet( idPet: number, idAdotante: number ) {
    const pet = await this.petRepository.findOne({ where: { id: idPet } });
    if (!pet) {
      throw new NaoEncontrado("Pet não encontrado");
    }

    const adotante = await this.adotanteRepository.findOne({
      where: { id: idAdotante },
    });
    if (!adotante) {
      throw new NaoEncontrado("Adotante não encontrado");
    }

    pet.adotante = adotante;
    pet.adotado = true;
    await this.petRepository.save(pet);
    return { success: true };
  }

  async alocaPetAbrigo( idPet: number, idAbrigo: number ) {
    const pet = await this.petRepository.findOne({ where: { id: idPet } });
    if (!pet) {
      throw new NaoEncontrado("Pet não encontrado");
    }

    const abrigo = await this.abrigoRepository.findOne({ where: { id: idAbrigo } });
    if (!abrigo) {
      throw new NaoEncontrado("Abrigo não encontrado");
    }

    pet.abrigo = abrigo;
    await this.petRepository.save(pet);
    return { success: true };
  }

  async buscaPetPorCampoGenerico<Tipo extends keyof PetEntity>(
    campo: Tipo,
    valor: PetEntity[Tipo]
  ): Promise<PetEntity[]> {
    const pets = await this.petRepository.find({ where: { [campo]: valor } });
    return pets;
  }
}
