import {Errors, Response} from "./types";

export const okResponse = (body: string): Response => {
    return {
        statusCode: 200,
        body,
    }
};

export const createdResponse = (): Response => {
    return {
        statusCode: 201,
    }
};

export const badRequestResponse = (message: string): Response => {
    return {
        statusCode: 400,
        body: message,
    }
};

export const notFoundResponse = (): Response => {
    return {
        statusCode: 404,
    }
}

export const internalServerErrorResponse = (): Response => {
    return {
        statusCode: 500,
        body: 'Internal Server Error',
    };
}

export const handleError = (err: Errors) => {
    switch (err.type) {
        case 'ClientError': {
            return badRequestResponse(err.message);
        }
        case 'NotFoundError': {
            return notFoundResponse();
        }
        case 'ServerError': {
            console.warn(err.message);
            return internalServerErrorResponse();
        }
        default: {
            const oops: never = err;
            return oops;
        }
    }
}
