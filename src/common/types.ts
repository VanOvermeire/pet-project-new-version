export type RetrievePetRequest = {
    readonly id: string,
    readonly clientId: string,
};

export type AddPetRequest = {
    readonly id: string,
    readonly clientId: string,
    readonly name: string,
    readonly age: number,
    readonly cuteness: string,
    readonly type: string,
};

export type RetrieveWildAnimalRequest = {
    readonly id: string,
    readonly type: string,
};

export type AddWildAnimalRequest = {
    readonly id: string,
    readonly type: string,
    readonly age: number,
};

/* errors and responses */

export type Response = {
    readonly statusCode: number,
    readonly body?: string,
}

export type ClientError = {
    readonly type: 'ClientError',
    readonly message: string,
}

export type ServerError = {
    readonly type: 'ServerError',
    readonly message: string,
}

export type NotFoundError = {
    readonly type: 'NotFoundError',
}

export type Errors = ClientError | ServerError | NotFoundError;
