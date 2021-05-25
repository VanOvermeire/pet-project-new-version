import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task'
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {pipe} from "fp-ts/function";
import {preparePetGet} from "./anticorruption";
import {retrieveFromDatabase} from "./database";
import {handleError, okResponse} from "../common/responses";
import {Response} from "../common/types";

export const getPet = async (event: APIGatewayProxyEventV2): Promise<Response> => {
    return pipe(
        preparePetGet(event),
        TE.fromEither,
        TE.chain(retrieveFromDatabase),
        TE.map(JSON.stringify),
        TE.bimap(handleError, okResponse),
        TE.getOrElse(T.of)
    )();
};
