import { EnumHttpStatusCode } from "../enum/EnumHttpStatusCode";

export class ManipulaErros extends Error {
    readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }

}

export class RequisicaoRuim extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.BAD_REQUEST, message);
    }
}

export class NaoEncontrado extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.NOT_FOUND, message);
    }
}