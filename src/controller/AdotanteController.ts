import { Request, Response } from "express";
import * as yup from "yup";
import AdotanteEntity from "../entities/AdotanteEntity";
import AdotanteRepository from "../repositories/AdotanteRepository";
import EnderecoEntity from "../entities/EnderecoEntity";
import { TipoRequestBodyAdotante, TipoRequestParamsAdotante, TipoResponseBodyAdotante } from "../tipos/tiposAdotante";
import { NaoEncontrado, RequisicaoRuim } from "../utils/manipulaErros";

const adotanteBodyValidator: yup.ObjectSchema<Omit<TipoRequestBodyAdotante, "endereco">> = yup.object().shape({
  nome: yup.string().defined().required("O nome é obrigatório"),
  senha: yup.string().defined().required("A senha é obrigatória").min(6),
  cpf: yup.string().defined().required("O CPF é obrigatório"),
  celular: yup.string().defined().required("O celular é obrigatório"),
  email: yup.string().defined().required("O email é obrigatório"),
  foto: yup.string().optional()
});

export default class AdotanteController {
  constructor(private repository: AdotanteRepository) {}
  async criaAdotante(
    req: Request<TipoRequestParamsAdotante, {}, TipoRequestBodyAdotante>,
    res: Response<TipoResponseBodyAdotante>
  ) {
    const { nome, cpf, celular, endereco, email, foto, senha } = <AdotanteEntity>req.body;
    let bodyValidated: TipoRequestBodyAdotante;
    try {
      bodyValidated = await adotanteBodyValidator.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      const yupErrors = error as yup.ValidationError;
      const validationErrors:Record<string, string> = {};
      yupErrors.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      throw new RequisicaoRuim("Dados de entrada inválidos");
    }

    const novoAdotante = new AdotanteEntity(
      nome,
      senha,
      cpf,
      celular,
      email,
      foto,
      endereco
    );

    await this.repository.criaAdotante(novoAdotante);
    return res
      .status(201)
      .json({ dados: { id: novoAdotante.id, nome, cpf, celular, email, endereco } });
  }
  async atualizaAdotante(
    req: Request<TipoRequestParamsAdotante, {}, TipoRequestBodyAdotante>,
    res: Response<TipoResponseBodyAdotante>
  ) {
    const { id } = req.params;
    const { success } = await this.repository.atualizaAdotante(
      Number(id),
      req.body as AdotanteEntity
    );

    if (!success) {
      throw new RequisicaoRuim("Não foi possível atualizar o adotante");
    }

    return res.sendStatus(204);
  }

  async listaAdotantes(
    req: Request<TipoRequestParamsAdotante, {}, TipoRequestBodyAdotante>,
    res: Response<TipoResponseBodyAdotante>
  ) {
    const listaDeAdotantes = await this.repository.listaAdotantes();
    const data = listaDeAdotantes.map((adotante) => {
      return {
        id: adotante.id,
        nome: adotante.nome,
        cpf: adotante.cpf,
        celular: adotante.celular,
        email: adotante.email,
        endereco: adotante.endereco!==null? adotante.endereco : undefined,
      };
    });
    return res.json({ dados: data });
  }

  async deletaAdotante(
    req: Request<TipoRequestParamsAdotante, {}, TipoRequestBodyAdotante>,
    res: Response<TipoResponseBodyAdotante>
  ) {
    const { id } = req.params;

    const { success } = await this.repository.deletaAdotante(
      Number(id)
    );

    if (!success) {
      throw new RequisicaoRuim("Não foi possível deletar o adotante");
    }
    return res.sendStatus(204);
  }

  async atualizaEnderecoAdotante(req: Request<TipoRequestParamsAdotante, {}, EnderecoEntity>,  res: Response<TipoResponseBodyAdotante>) {
    const { id } = req.params;
    const {success} = await this.repository.atualizaEnderecoAdotante(Number(id), req.body);

    if (!success) {
      throw new RequisicaoRuim("Não foi possível atualizar o endereço do adotante");
    }
    return res.sendStatus(204);
  }
}
