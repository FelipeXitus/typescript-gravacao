import { Request, Response } from "express";
import * as yup from "yup";
import AbrigoEntity from "../entities/AbrigoEntity";
import AbrigoRepository from "../repositories/AbrigoRepository";
import EnderecoEntity from "../entities/EnderecoEntity";
import { TipoRequestBodyAbrigo, TipoRequestParamsAbrigo, TipoResponseBodyAbrigo } from "../tipos/tiposAbrigo";
import { RequisicaoRuim } from "../utils/manipulaErros";

const abrigoBodyValidator: yup.ObjectSchema<Omit<TipoRequestBodyAbrigo, "endereco">> = yup.object().shape({
  nome: yup.string().defined().required("O nome é obrigatório"),
  senha: yup.string().defined().required("A senha é obrigatória").min(6),
  cnpj: yup.string().defined().required("O CNPJ é obrigatório"),
  celular: yup.string().defined().required("O celular é obrigatório"),
  email: yup.string().defined().required("O email é obrigatório"),
  foto: yup.string().optional()
});

export default class AbrigoController {
  constructor(private repository: AbrigoRepository) {}
  async criaAbrigo(
    req: Request<TipoRequestParamsAbrigo, {}, TipoRequestBodyAbrigo>,
    res: Response<TipoResponseBodyAbrigo>
  ) {
    const { nome, cnpj, celular, endereco, email, senha } = <AbrigoEntity>req.body;
    let bodyValidated: TipoRequestBodyAbrigo;
    try {
      bodyValidated = await abrigoBodyValidator.validate(req.body, {
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

    const novoAbrigo = new AbrigoEntity(
      nome,
      email,
      celular,
      cnpj,
      senha
    );
    novoAbrigo.endereco = endereco;

    await this.repository.criaAbrigo(novoAbrigo);
    return res
      .status(201)
      .json({ dados: { id: novoAbrigo.id, nome, cnpj, celular, email, endereco } });
  }
  async atualizaAbrigo(
    req: Request<TipoRequestParamsAbrigo, {}, TipoRequestBodyAbrigo>,
    res: Response<TipoResponseBodyAbrigo>
  ) {
    const { id } = req.params;
    const { success } = await this.repository.atualizaAbrigo(
      Number(id),
      req.body as AbrigoEntity
    );

    if (!success) {
      throw new RequisicaoRuim("Não foi possível atualizar o abrigo");
    }

    return res.sendStatus(204);
  }

  async listaAbrigos(
    req: Request<TipoRequestParamsAbrigo, {}, TipoRequestBodyAbrigo>,
    res: Response<TipoResponseBodyAbrigo>
  ) {
    const listaDeAbrigos = await this.repository.listaAbrigos();
    const data = listaDeAbrigos.map((abrigo) => {
      return {
        id: abrigo.id,
        nome: abrigo.nome,
        cnpj: abrigo.cnpj,
        celular: abrigo.celular,
        email: abrigo.email,
        endereco: abrigo.endereco!==null? abrigo.endereco : undefined,
      };
    });
    return res.json({ dados: data });
  }

  async deletaAbrigo(
    req: Request<TipoRequestParamsAbrigo, {}, TipoRequestBodyAbrigo>,
    res: Response<TipoResponseBodyAbrigo>
  ) {
    const { id } = req.params;

    const { success } = await this.repository.deletaAbrigo(
      Number(id)
    );

    if (!success) {
      throw new RequisicaoRuim("Não foi possível deletar o abrigo");
    }
    return res.sendStatus(204);
  }

  async atualizaEnderecoAbrigo(req: Request<TipoRequestParamsAbrigo, {}, EnderecoEntity>,  res: Response<TipoResponseBodyAbrigo>) {
    const { id } = req.params;
    const {success} = await this.repository.atualizaEnderecoAbrigo(Number(id), req.body);

    if (!success) {
      throw new RequisicaoRuim("Não foi possível atualizar o endereço do abrigo");
    }
    return res.sendStatus(204);
  }
}
