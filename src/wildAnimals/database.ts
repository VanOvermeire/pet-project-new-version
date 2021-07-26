import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import UpdateItemInput = DocumentClient.UpdateItemInput;
import {pipe} from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import {getItem, getParallel, post, update} from "../common/gateway";
import {parallelCheckEmpty} from "../common/validation";
import {serverError} from "../common/errors";
import {AddWildAnimalRequest, RetrieveWildAnimalRequest} from "../common/types";
import {COUNTER_PREFIX, WILD_ANIMALS_PREFIX} from "../constants";

// instead of getting database name from environment, should be injected (probably with IO)

const buildGet = (request: RetrieveWildAnimalRequest) => {
    return {
        TableName: process.env.DATABASE_NAME,
        Key: {
            ppId: `${WILD_ANIMALS_PREFIX}#${request.type}`,
            psId: request.id,
        },
    };
};

const buildCounterGet = (request: RetrieveWildAnimalRequest) => {
    return {
        TableName: process.env.DATABASE_NAME,
        Key: {
            ppId: `${WILD_ANIMALS_PREFIX}#${COUNTER_PREFIX}`,
            psId: request.type,
        },
    }
};

const buildPost = (request: AddWildAnimalRequest) => ({
    TableName: process.env.DATABASE_NAME,
    Item: {
        ppId: `${WILD_ANIMALS_PREFIX}#${request.type}`,
        psId: request.id,
        id: request.id,
        age: request.age,
        type: request.type
    }
});

const buildCounterInit = (request: AddWildAnimalRequest) => ({
    TableName: process.env.DATABASE_NAME,
    Item: {
        ppId: `${WILD_ANIMALS_PREFIX}#${COUNTER_PREFIX}`,
        psId: request.type,
        itemCount: 0,
    },
    ConditionExpression: 'attribute_not_exists(itemCount)',
});

const buildCounterUpdate = (request: AddWildAnimalRequest): UpdateItemInput => ({
    TableName: process.env.DATABASE_NAME,
    Key: {
        ppId: `${WILD_ANIMALS_PREFIX}#${COUNTER_PREFIX}`,
        psId: request.type,
    },
    UpdateExpression: 'Set itemCount = itemCount + :incr',
    ExpressionAttributeValues: {
        ':incr': 1,
    },
    ReturnValues: 'UPDATED_NEW',
});

export const retrieveFromDatabase = (request: RetrieveWildAnimalRequest) => {
    return pipe(
        [buildGet(request), buildCounterGet(request)],
        requests => getParallel(requests),
        TE.chain(parallelCheckEmpty),
        TE.map(results => results.map(getItem))
    );
};

export const putInDatabase = (request: AddWildAnimalRequest) => {
    return pipe(
        buildCounterInit(request),
        (params) => TE.tryCatch(() => post(params), serverError),
        TE.fold(() => TE.right(request), () => TE.right(request)), // ignore failure on existing error
        TE.chainFirst((params) => TE.tryCatch(() => post(buildPost(params)), serverError)),
        TE.chainFirst((params) => TE.tryCatch(() => update(buildCounterUpdate(params)), serverError)) // like in original, only update when previous succeeds
    );
};
