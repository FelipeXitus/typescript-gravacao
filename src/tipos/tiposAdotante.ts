import AdotanteEntity from "../entities/AdotanteEntity";

type TipoRequestBodyAdotante = Omit<AdotanteEntity, "id" | "pets">;

type TipoRequestParamsAdotante = { id?: string };

type TipoResponseBodyAdotante = {
  dados?:
    | Pick<AdotanteEntity, "id" | "nome" | "celular" | "email" | "endereco">
    | Pick<AdotanteEntity, "id" | "nome" | "celular" | "email" | "endereco">[];
  erros?: unknown;
};

export {
  TipoRequestBodyAdotante,
  TipoResponseBodyAdotante,
  TipoRequestParamsAdotante,
};
