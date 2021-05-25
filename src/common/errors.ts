import {ClientError, NotFoundError, ServerError} from "./types";

export const clientError = (message: string): ClientError => {
    return {
        type: "ClientError",
        message,
    }
};

export const serverError = (message: string): ServerError => {
    return {
        type: "ServerError",
        message,
    }
};

export const notFound = (): NotFoundError => {
    return {
        type: "NotFoundError",
    };
};
