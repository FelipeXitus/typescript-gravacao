import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { TipoRequestBodyPet } from "../../tipos/tiposPet";
import { pt } from "yup-locale-pt";
import EnumEspecie from "../../enum/EnumEspecie";
import EnumPorte from "../../enum/EnumPorte";

yup.setLocale(pt);

const schemaBodyPet: yup.ObjectSchema<Omit<TipoRequestBodyPet, "adotante">> = yup.object().shape({
  nome: yup.string().defined().required("O nome é obrigatório"),
  especie: yup.string().oneOf(Object.values(EnumEspecie)).defined().required("A especie é obrigatória"),
  porte: yup.string().oneOf(Object.values(EnumPorte)).defined().optional(),
  dataDeNascimento: yup.date().defined().required("A data de nascimento é obrigatória").max(new Date(), "A data de nascimento não pode ser no futuro"),
  adotado: yup.boolean().defined().required("O campo adotado é obrigatório")
});

export const middlewareValidaBodyPet = (req: Request, res: Response, next: NextFunction) => {
  schemaBodyPet.validate(req.body, { abortEarly: false })
    .then(() => next())
    .catch((err) => res.status(400).json({ errors: err.errors }));
};