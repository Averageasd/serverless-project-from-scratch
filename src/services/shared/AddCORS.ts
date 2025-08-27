import { APIGatewayProxyResult } from "aws-lambda";

export function addCorsHeader(arg: APIGatewayProxyResult){
    if (!arg.headers){
        arg.headers = {};
    }
    arg.headers['Access-Control-Allow-Origin'] = '*';
    arg.headers['Access-Control-Allow-Methods'] = '*';
    arg.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token';
}