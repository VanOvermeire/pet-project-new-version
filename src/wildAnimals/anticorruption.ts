import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import * as E from "fp-ts/Either";
import {pipe} from "fp-ts/function";
import { AddWildAnimalRequest, Errors, RetrieveWildAnimalRequest } from "../common/types";
import {checkBody, checkQueryString} from "../common/validation";
import {clientError} from "../common/errors";

const parseEvent = (event: APIGatewayProxyEventV2): RetrieveWildAnimalRequest => ({
    id: event.queryStringParameters.id,
    type: event.queryStringParameters.type,
});

const parseEventFromBody = (parsedBody: E.Json): AddWildAnimalRequest => {
    const records = parsedBody as E.JsonRecord;

    return {
        id: records.id as string,
        age: records.age as number,
        type: records.type as string,
    };
};

export const prepareWildAnimalGet = (event: APIGatewayProxyEventV2): E.Either<Errors, RetrieveWildAnimalRequest> =>
    pipe(
        checkQueryString(event),
        E.map(parseEvent),
    );

export const prepareWildAnimalPost = (event: APIGatewayProxyEventV2): E.Either<Errors, AddWildAnimalRequest> =>
    pipe(
        E.parseJSON(event.body, () => clientError('Invalid json body')),
        E.chain(checkBody),
        E.map(parseEventFromBody),
    );
