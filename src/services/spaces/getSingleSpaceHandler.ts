import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSingleSpace } from "./GetSingleSpace";
import { addCorsHeader } from "../shared/AddCORS";


async function getSingleSpaceHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const dbClient = new DynamoDBClient({});
    let repsponse : APIGatewayProxyResult;
    try{
        repsponse = await getSingleSpace(event, dbClient);
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

export {getSingleSpaceHandler}