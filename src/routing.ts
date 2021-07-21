import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {GET_METHOD, POST_METHOD} from "./constants";
import {getPet, postPet} from "./pets/entrypoint";
import {getWildAnimal, postWildAnimal} from "./wildAnimals/entrypoint";

// query string params instead of path - because that would require more logic here
export const route = async (event: APIGatewayProxyEventV2) => {
    const path = event.requestContext?.http?.path;
    const method = event.requestContext?.http?.method;

    if (path === '/pets') {
        if (method === GET_METHOD) {
            return getPet(event);
        } else if(method === POST_METHOD) {
            return postPet(event);
        }
    } else if(path === '/wild') {
        if (method === GET_METHOD) {
            return getWildAnimal(event);
        } else if(method === POST_METHOD) {
            return postWildAnimal(event);
        }
    }
    throw new Error(`Invalid route for ${JSON.stringify(event)}`); // can be better, ok for demonstration purposes
};
