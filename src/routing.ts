import {GET_METHOD, POST_METHOD} from "./constants";
import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {getPet, postPet} from "./pets/entrypoint";

// query string params instead of path - because that would require more logic here
export const route = async (event: APIGatewayProxyEventV2) => {
    if (event.requestContext?.http?.path === '/pets') {
        if (event.requestContext?.http?.method === GET_METHOD) {
            return getPet(event);
        } else if(event.requestContext?.http?.method === POST_METHOD) {
            return postPet(event);
        }
    }
    throw new Error(`Invalid route for ${JSON.stringify(event)}`); // can be better, ok for demonstration purposes
};
