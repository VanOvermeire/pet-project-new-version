export type RetrievePetRequest = {
    id: string,
    clientId: string,
};

/* errors and responses */

export type Response = {
    statusCode: number,
    body?: string,
}

export type ClientError = {
    type: 'ClientError',
    message: string,
}

export type ServerError = {
    type: 'ServerError',
    message: string,
}

export type NotFoundError = {
    type: 'NotFoundError',
}

export type Errors = ClientError | ServerError | NotFoundError;
