import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemInput = DocumentClient.GetItemInput;
import PutItemInput = DocumentClient.PutItemInput;

const client = new DynamoDB.DocumentClient({region: 'eu-west-1'});

export const get = (params: GetItemInput) => client.get(params).promise();

export const post = (params: PutItemInput) => client.put(params).promise();
