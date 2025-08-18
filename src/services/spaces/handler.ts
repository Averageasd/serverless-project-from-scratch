import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpace } from "./PostSpace";
import { getSpaces } from "./GetSpaces";
import { MissingFieldError } from "../shared/Validator";


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const dbClient = new DynamoDBClient({});
    let message: string;
    try{
        switch(event.httpMethod){
        case 'GET':
            return getSpaces(event, dbClient);
        case 'POST':
            return postSpace(event, dbClient);
        default:
            break;
        }
    }
    catch (error:any){
        if (error instanceof MissingFieldError){
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    };

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(`action is ${message}`)
    }
    return response;
};

export {handler}