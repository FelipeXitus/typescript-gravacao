import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { TipoRequestBodyAdotante } from "../../tipos/tiposAdotante";
import { pt } from "yup-locale-pt";

yup.setLocale(pt);

const schemaBodyAdotante: yup.ObjectSchema<Omit<TipoRequestBodyAdotante, "endereco">> = yup.object().shape({
  nome: yup.string().defined().required("O nome é obrigatório"),
  senha: yup.string().defined().required("A senha é obrigatória").matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm, "A senha deve conter entre 8 e 16 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial"),
  celular: yup.string().defined().required("O celular é obrigatório").matches(/^(\(?[0-9]{2}\)?)? ?([0-9]{4,5})-?([0-9]{4})$/gm, "O celular deve estar no formato (XX) XXXXX-XXXX ou XXXXXXXXXXX"),
  email: yup.string().defined().required("O email é obrigatório").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "O email deve ser um endereço de email válido"),
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