import {APIGatewayProxyEventV2} from "aws-lambda/trigger/api-gateway-proxy";
import {route} from "./routing";

export const handler = async (event: APIGatewayProxyEventV2) => {
    console.log(JSON.stringify(event));
    return route(event);
};
