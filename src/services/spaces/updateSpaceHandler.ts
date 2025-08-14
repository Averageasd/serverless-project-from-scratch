import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { putSpace } from "./PutSpace";


async function updateSingleSpaceHandler(
    event: APIGatewayProxyEvent, 
    context: Context): Promise<APIGatewayProxyResult> {
    
    const dbClient = new DynamoDBClient({});
    try{
        return putSpace(event, dbClient);
    }
    catch (error:any){
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    };
};

export {updateSingleSpaceHandler}