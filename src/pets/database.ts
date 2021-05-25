import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemOutput = DocumentClient.GetItemOutput;
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import {Errors, RetrievePetRequest} from "../common/types";
import {pipe} from "fp-ts/function";
import {get} from "../common/gateway";
import {notFound, serverError} from "../common/errors";

const PETS_ID_PREFIX = 'P';

// probably useful for common section in a more generic way
const buildPetGet = (request: RetrievePetRequest) => ({
    TableName: process.env.DATABASE_NAME, // not great
    Key: {
        ppId: `${PETS_ID_PREFIX}#${request.clientId}`,
        psId: request.id,
    },
});
// probably useful for common section
const checkIfEmpty = (item: GetItemOutput): E.Either<Errors, GetItemOutput> => item.Item ? E.right(item) : E.left(notFound());
const checkIfEmptyTE = (res: GetItemOutput) => TE.fromEither(checkIfEmpty(res));

export const retrieveFromDatabase = (request: RetrievePetRequest) =>
    pipe(
        buildPetGet(request),
        (params) => TE.tryCatch(() => get(params), serverError),
        TE.chain(checkIfEmptyTE),
        TE.map(res => res.Item)
    );