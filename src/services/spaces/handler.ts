import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpace } from "./PostSpace";
import { getSpaces } from "./GetSpaces";
import { MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/AddCORS";


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const dbClient = new DynamoDBClient({});
    let response: APIGatewayProxyResult;
    let message: string;
    try{
        switch(event.httpMethod){
        case 'GET':
            response = await getSpaces(event, dbClient);
            addCorsHeader(response);
            return response;
        case 'POST':
            response = await postSpace(event, dbClient);
            addCorsHeader(response);
            return response;
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

    response =  {
        statusCode: 200,
        body: JSON.stringify(`action is ${message}`)
    } as APIGatewayProxyResult;
    addCorsHeader(response);
    
    return response;
};

export {handler}