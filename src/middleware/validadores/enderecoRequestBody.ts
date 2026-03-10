import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import EnderecoEntity from "../../entities/EnderecoEntity";
import { pt } from "yup-locale-pt";
import tratarErroValidacaoYup from "../../utils/trataValidacaoYup";

yup.setLocale(pt);

const schemaBodyEndereco: yup.ObjectSchema<Omit<EnderecoEntity, "id">> = yup.object().shape({
  cep: yup.string().defined().required("O CEP é obrigatório"),
  logradouro: yup.string().defined().required("O logradouro é obrigatório"),
  numero: yup.string().defined().required("O número é obrigatório"),
  complemento: yup.string().optional(),
  cidade: yup.string().defined().required("A cidade é obrigatória"),
  estado: yup.string().defined().required("O estado é obrigatório")
});

export const middlewareValidadorBodyEndereco = async (req: Request, res: Response, next: NextFunction) => {
    tratarErroValidacaoYup(schemaBodyEndereco, req, res, next);  
};