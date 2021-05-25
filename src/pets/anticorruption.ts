import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import * as E from 'fp-ts/Either'
import {RetrievePetRequest} from "../common/types";
import {pipe} from "fp-ts/function";
import {clientError} from "../common/errors";

// probably useful for common section
const inValid = (value: string) => !value.trim();
// probably useful for common section
const checkQueryString = (event: APIGatewayProxyEventV2) =>
    Object.entries(event.queryStringParameters).some(entry => inValid(entry[0]) || inValid(entry[1])) ?
        E.left(clientError('Query string validation error')) : E.right(event);

const parseEvent = (event: APIGatewayProxyEventV2): RetrievePetRequest => ({
    id: event.queryStringParameters.id,
    clientId: event.queryStringParameters.clientId,
});

export const preparePetGet = (event: APIGatewayProxyEventV2) => {
    return pipe(
        checkQueryString(event),
        E.map(parseEvent),
    );
};
