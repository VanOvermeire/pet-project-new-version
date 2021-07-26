import * as TE from 'fp-ts/TaskEither';
import {pipe} from "fp-ts/function";
import {AddPetRequest, RetrievePetRequest} from "../common/types";
import {get, getItem, post} from "../common/gateway";
import {serverError} from "../common/errors";
import {checkEmptyTE} from "../common/validation";
import {PETS_ID_PREFIX} from "../constants";

// instead of getting database name from environment, should be injected (probably with IO)

// might be made more generic way
const buildGet = (request: RetrievePetRequest) => ({
    TableName: process.env.DATABASE_NAME,
    Key: {
        ppId: `${PETS_ID_PREFIX}#${request.clientId}`,
        psId: request.id,
    },
});

const buildPost = (request: AddPetRequest) => ({
    TableName: process.env.DATABASE_NAME,
    Item: {
        ppId: `${PETS_ID_PREFIX}#${request.clientId}`,
        psId: request.id,
        id: request.id,
        clientId: request.clientId,
        name: request.name,
        age: request.age,
        cuteness: request.cuteness,
        type: request.type
    }
});

export const retrieveFromDatabase = (request: RetrievePetRequest) =>
    pipe(
        buildGet(request),
        (params) => TE.tryCatch(() => get(params), serverError),
        TE.chain(checkEmptyTE),
        TE.map(getItem)
    );

export const putInDatabase = (request: AddPetRequest) =>
    pipe(
        buildPost(request),
        (params) => TE.tryCatch(() => post(params), serverError),
    );
