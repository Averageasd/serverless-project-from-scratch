import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { deleteSpace } from "./DeleteSpace";


async function deleteSpaceHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const dbClient = new DynamoDBClient({});
    try{
        return deleteSpace(event, dbClient);
    }
    catch (error:any){
        return {
            statusCode: 500,
            body: JSON.stringify('internal error')
        }
    };
};

export {deleteSpaceHandler}