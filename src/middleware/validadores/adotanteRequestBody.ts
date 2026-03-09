import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { TipoRequestBodyAdotante } from "../../tipos/tiposAdotante";

const schemaBodyAdotante: yup.ObjectSchema<Omit<TipoRequestBodyAdotante, "endereco">> = yup.object().shape({
  nome: yup.string().defined().required("O nome é obrigatório"),
  senha: yup.string().defined().required("A senha é obrigatória").min(6),
  celular: yup.string().defined().required("O celular é obrigatório"),
  email: yup.string().defined().required("O email é obrigatório"),
  foto: yup.string().optional()
});

const middlewareValidadorBodyAdotante = async (req: Request, res: Response, next: NextFunction) => {
try {
    await schemaBodyAdotante.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });
    return next();
} catch (error) {
    const yupErrors = error as yup.ValidationError;
    const validationErrors:Record<string, string> = {};
    yupErrors.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
    });
    return res.status(400).json({ error: validationErrors });
}
};

export default middlewareValidadorBodyAdotante;