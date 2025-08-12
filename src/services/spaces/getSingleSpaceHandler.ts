import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSingleSpace } from "./GetSingleSpace";


async function getSingleSpaceHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    console.log(event);
    const dbClient = new DynamoDBClient({});
    let message: string;
    try{
        switch(event.httpMethod){
        case 'GET':
            return getSingleSpace(event, dbClient);
        default:
            break;
        }
    }
    catch (error:any){
        return {
            statusCode: 500,
            body: JSON.stringify('internal error')
        }
    };

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(`action is ${message}`)
    }
    return response;
};

export {getSingleSpaceHandler}