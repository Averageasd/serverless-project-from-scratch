import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { deleteSpace } from "./DeleteSpace";
import { addCorsHeader } from "../shared/AddCORS";


async function deleteSpaceHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const dbClient = new DynamoDBClient({});
    let repsponse : APIGatewayProxyResult;
    try{
        repsponse = await deleteSpace(event, dbClient);
        addCorsHeader(repsponse);
    }
    catch (error:any){
        repsponse = {
            statusCode: 500,
            body: JSON.stringify('internal error')
        } as APIGatewayProxyResult;
        addCorsHeader(repsponse);
        return repsponse;
    };

    return repsponse;
};

export {deleteSpaceHandler}