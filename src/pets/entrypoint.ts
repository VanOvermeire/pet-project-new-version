import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task'
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {pipe} from "fp-ts/function";
import {preparePetGet, preparePetPost} from "./anticorruption";
import {putInDatabase, retrieveFromDatabase} from "./database";
import {createdResponse, handleError, okResponse} from "../common/responses";
import {Response} from "../common/types";

export const getPet = async (event: APIGatewayProxyEventV2): Promise<Response> => {
    return pipe(
        preparePetGet(event),
        p => TE.fromEither(p),
        TE.chain(retrieveFromDatabase),
        TE.map(JSON.stringify),
        TE.bimap(handleError, okResponse),
        TE.getOrElse(T.of)
    )();
};

export const postPet = async (event: APIGatewayProxyEventV2): Promise<Response> => {
    return pipe(
        preparePetPost(event),
        p => TE.fromEither(p),
        TE.chain(putInDatabase),
        TE.bimap(handleError, createdResponse),
        TE.getOrElse(T.of)
    )();
};
