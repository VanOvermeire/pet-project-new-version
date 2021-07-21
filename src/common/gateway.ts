import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemInput = DocumentClient.GetItemInput;
import PutItemInput = DocumentClient.PutItemInput;
import GetItemOutput = DocumentClient.GetItemOutput;
import PutItemOutput = DocumentClient.PutItemOutput;
import * as A from "fp-ts/Array";
import * as TE from "fp-ts/TaskEither";
import {serverError} from "./errors";
import {Errors} from "./types";
import UpdateItemInput = DocumentClient.UpdateItemInput;

const client = new DynamoDB.DocumentClient({region: 'eu-west-1'});

export const get = (params: GetItemInput) => client.get(params).promise();

export const post = (params: PutItemInput) => client.put(params).promise();

export const update = (params: UpdateItemInput) => client.update(params).promise();

export const getParallel = (inputs: GetItemInput[]): TE.TaskEither<Errors, GetItemOutput[]> => {
    return A.array.sequence(TE.taskEither)(
        inputs.map(input => TE.tryCatch(() => get(input), serverError))
    );
};

export const postParallel = (inputs: PutItemInput[]): TE.TaskEither<Errors, PutItemOutput[]> => {
    return A.array.sequence(TE.taskEither)(
        inputs.map(input => TE.tryCatch(() => post(input), serverError))
    );
};
