import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { TipoRequestBodyAbrigo } from "../../tipos/tiposAbrigo";
import { pt } from "yup-locale-pt";
import tratarErroValidacaoYup from "../../utils/trataValidacaoYup";

yup.setLocale(pt);

const schemaBodyAbrigo: yup.ObjectSchema<Omit<TipoRequestBodyAbrigo, "endereco">> = yup.object().shape({
    nome: yup.string().defined().required("O nome é obrigatório"),
    email: yup.string().defined().required("O email é obrigatório").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "O email deve ser um endereço de email válido"),
    celular: yup.string().defined().required("O celular é obrigatório").matches(/^(\(?[0-9]{2}\)?)? ?([0-9]{4,5})-?([0-9]{4})$/gm, "O celular deve estar no formato XXXXXXXXXXX"),
    cnpj: yup.string().defined().required("O CNPJ é obrigatório").matches(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "O CNPJ deve estar no formato XXXXXXXXXXXXXX"),
    senha: yup.string().defined().required("A senha é obrigatória").matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm, "A senha deve conter entre 8 e 16 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial")
});

export const middlewareValidadorBodyAbrigo = async (req: Request, res: Response, next: NextFunction) => {
  tratarErroValidacaoYup(schemaBodyAbrigo, req, res, next);  
};