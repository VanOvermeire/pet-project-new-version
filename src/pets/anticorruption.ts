import * as E from 'fp-ts/Either'
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {AddPetRequest, Errors, RetrievePetRequest} from "../common/types";
import {pipe} from "fp-ts/function";
import {clientError} from "../common/errors";

// probably useful for common section
const inValid = (value: string) => !value.trim();
// probably useful for common section
const checkQueryString = (event: APIGatewayProxyEventV2): E.Either<Errors, APIGatewayProxyEventV2> =>
    Object.entries(event.queryStringParameters).some(entry => inValid(entry[0]) || inValid(entry[1])) ?
        E.left(clientError('Query string validation error')) : E.right(event);
// probably useful for common section
const checkBody = (parsedBody: E.Json) => {
    return Object.keys(parsedBody).some(inValid) ?
        E.left(clientError('Body contained empty key')) : E.right(parsedBody);
}

const parseEvent = (event: APIGatewayProxyEventV2): RetrievePetRequest => ({
    id: event.queryStringParameters.id,
    clientId: event.queryStringParameters.clientId,
});

const parseEventFromBody = (parsedBody: E.Json): AddPetRequest => {
    const records = parsedBody as E.JsonRecord;

    return {
        id: records.id as string,
        clientId: records.clientId as string,
        name: records.name as string,
        age: records.age as number,
        cuteness: records.cuteness as string,
        type: records.type as string,
    };
}

export const preparePetGet = (event: APIGatewayProxyEventV2): E.Either<Errors, RetrievePetRequest> =>
    pipe(
        checkQueryString(event),
        E.map(parseEvent),
    );

export const preparePetPost = (event: APIGatewayProxyEventV2): E.Either<Errors, AddPetRequest> =>
    pipe(
        E.parseJSON(event.body, () => clientError('Invalid json body')),
        E.chain(checkBody),
        E.map(parseEventFromBody),
    );
