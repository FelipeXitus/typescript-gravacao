import AdotanteEntity from "../entities/AdotanteEntity";

type TipoRequestBodyAdotante = Omit<AdotanteEntity, "id" | "pets">;

type TipoRequestParamsAdotante = { id?: string };

type TipoResponseBodyAdotante = {
  dados?:
    | Pick<AdotanteEntity, "id" | "nome" | "cpf" | "celular" | "email" | "endereco">
    | Pick<AdotanteEntity, "id" | "nome" | "cpf" | "celular" | "email" | "endereco">[];
};

export {
  TipoRequestBodyAdotante,
  TipoResponseBodyAdotante,
  TipoRequestParamsAdotante,
};
