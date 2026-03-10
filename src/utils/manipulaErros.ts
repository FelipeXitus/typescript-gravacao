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

export class ErroInterno extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.INTERNAL_SERVER_ERROR, message);
    }
}

export class NaoAutorizado extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.UNAUTHORIZED, message);
    }
}

export class Proibido extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.FORBIDDEN, message);
    }
}

export class Conflito extends ManipulaErros {
    constructor(message: string) {
        super(EnumHttpStatusCode.CONFLICT, message);
    }
}