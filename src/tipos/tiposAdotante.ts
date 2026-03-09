import AdotanteEntity from "../entities/AdotanteEntity";

type TipoRequestBodyAdotante = Omit<AdotanteEntity, "id" | "pets">;

type TipoRequestParamsAdotante = { id?: string };

type TipoResponseBodyAdotante = {
  data?:
    | Pick<AdotanteEntity, "id" | "nome" | "celular" | "email">
    | Pick<AdotanteEntity, "id" | "nome" | "celular" | "email">[];
  error?: unknown;
};

export {
  TipoRequestBodyAdotante,
  TipoResponseBodyAdotante,
  TipoRequestParamsAdotante,
};
