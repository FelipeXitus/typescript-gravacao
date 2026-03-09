import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import EnderecoEntity from "../../entities/EnderecoEntity";
import { TipoRequestBodyAdotante } from "../../tipos/tiposAdotante";

const schemaBodyEndereco: yup.ObjectSchema<Omit<EnderecoEntity, "id">> = yup.object().shape({
  cep: yup.string().defined().required("O CEP é obrigatório"),
  logradouro: yup.string().defined().required("O logradouro é obrigatório"),
  numero: yup.string().defined().required("O número é obrigatório"),
  complemento: yup.string().optional(),
  cidade: yup.string().defined().required("A cidade é obrigatória"),
  estado: yup.string().defined().required("O estado é obrigatório")
});

const middlewareValidadorBodyEndereco = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schemaBodyEndereco.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    return next();
  } catch (error) {
    const yupErrors = error as yup.ValidationError;
    const validationErrors: Record<string, string> = {};
    yupErrors.inner.forEach((err) => {
      if (err.path) {
        validationErrors[err.path] = err.message;
      }
    });
    return res.status(400).json({ error: validationErrors });
  }
};

export default middlewareValidadorBodyEndereco;