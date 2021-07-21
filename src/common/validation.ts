import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemOutput = DocumentClient.GetItemOutput;
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import {Errors} from "./types";
import {clientError, notFound} from "./errors";

export const inValid = (value: string) => !value.trim();

export const checkQueryString = (event: APIGatewayProxyEventV2): E.Either<Errors, APIGatewayProxyEventV2> =>
    Object.entries(event.queryStringParameters).some(entry => inValid(entry[0]) || inValid(entry[1])) ?
        E.left(clientError('Query string validation error')) : E.right(event);

export const checkBody = (parsedBody: E.Json) => {
    return Object.keys(parsedBody).some(inValid) ?
        E.left(clientError('Body contained empty key')) : E.right(parsedBody);
};

const checkEmpty = (item: GetItemOutput): E.Either<Errors, GetItemOutput> => item.Item ? E.right(item) : E.left(notFound());

export const checkEmptyTE = (res: GetItemOutput) => TE.fromEither(checkEmpty(res));

export const parallelCheckEmpty = (inputs: GetItemOutput[]): TE.TaskEither<Errors, GetItemOutput[]> => {
    return A.array.sequence(TE.taskEither)(
        inputs.map(input => checkEmptyTE(input))
    );
};
