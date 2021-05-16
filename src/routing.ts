import {GET_METHOD, POST_METHOD} from "./constants";
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";

export const route = async (event: APIGatewayProxyEventV2) => {
    if (event.requestContext?.http?.path === '/pets') {
        if (event.requestContext?.http?.method === GET_METHOD) {
            return 'TODO';
        } else if(event.requestContext?.http?.method === POST_METHOD) {
            return 'TODO';
        }
    }
    throw new Error(`Invalid route for ${JSON.stringify(event)}`); // can be better, ok for demonstration purposes
};
