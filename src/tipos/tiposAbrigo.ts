import AbrigoEntity from "../entities/AbrigoEntity";

type TipoRequestBodyAbrigo = Omit<AbrigoEntity, "id" | "pets">;

type TipoRequestParamsAbrigo = { id?: string };

type TipoResponseBodyAbrigo = {
  dados?:
    | Pick<AbrigoEntity, "id" | "nome" | "email" | "celular" | "cnpj" | "endereco">
    | Pick<AbrigoEntity, "id" | "nome" | "email" | "celular" | "cnpj" | "endereco">[];
};

export {
  TipoRequestBodyAbrigo,
  TipoResponseBodyAbrigo,
  TipoRequestParamsAbrigo,
};
