import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";

export const handler = async (event: APIGatewayProxyEventV2) => {
    console.log(JSON.stringify(event));
    return {
        statusCode: 200,
        body: 'hello world',
    }
};
