import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { putSpace } from "./PutSpace";
import { addCorsHeader } from "../shared/AddCORS";


async function updateSingleSpaceHandler(
    event: APIGatewayProxyEvent, 
    context: Context): Promise<APIGatewayProxyResult> {
    
    let response: APIGatewayProxyResult;
    const dbClient = new DynamoDBClient({});
    try{
        response = await putSpace(event, dbClient);
        addCorsHeader(response);
    }
    catch (error:any){
        response = {
            statusCode: 500,
            body: JSON.stringify(error.message)
        } as APIGatewayProxyResult;
        addCorsHeader(response);
        return response;
    };
    
    return response;
};

export {updateSingleSpaceHandler}