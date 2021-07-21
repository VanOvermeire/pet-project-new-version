import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {pipe} from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import {prepareWildAnimalGet, prepareWildAnimalPost} from "./anticorruption";
import {createdResponse, handleError, okResponse} from "../common/responses";
import {putInDatabase, retrieveFromDatabase} from "./database";
import {Response} from "../common/types";

export const getWildAnimal = async (event: APIGatewayProxyEventV2): Promise<Response> => {
    return pipe(
        prepareWildAnimalGet(event),
        p => TE.fromEither(p),
        TE.chain(retrieveFromDatabase),
        TE.map(JSON.stringify),
        TE.bimap(handleError, okResponse),
        TE.getOrElse(T.of)
    )();
};

export const postWildAnimal = async (event: APIGatewayProxyEventV2): Promise<Response> => {
    return pipe(
        prepareWildAnimalPost(event),
        p => TE.fromEither(p),
        TE.chain(putInDatabase),
        TE.bimap(handleError, createdResponse),
        TE.getOrElse(T.of)
    )();
};
