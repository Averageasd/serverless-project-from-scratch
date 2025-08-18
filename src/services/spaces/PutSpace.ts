import { 
    DynamoDBClient, 
    UpdateItemCommand, 
    UpdateItemCommandInput, 
    UpdateItemCommandOutput, 
    UpdateItemInput } 
    from "@aws-sdk/client-dynamodb";

import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult } 
    from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/Validator";

export async function putSpace (
    event: APIGatewayProxyEvent, 
    dbClient: DynamoDBClient): 
    Promise<APIGatewayProxyResult>{

    const item = JSON.parse(event.body);
    console.log(item);
    console.log(item.location);
    const {id} = event.pathParameters;

    validateAsSpaceEntry({
        id: id,
        name: item.name,
        location: item.name,
        photoUrl: item.photoUrl
    });

    const input: UpdateItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "id":{
                S: id
            },
        },
        ExpressionAttributeNames : {
            '#location' : "location",
            "#name" : "name",
        },
        ExpressionAttributeValues: {
            ':newLocation': {S: item.location},
            ':newName': {S: item.name}
        },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW",
        UpdateExpression:
            'set #location = :newLocation, #name = :newName',  
    };
    const command: UpdateItemCommand = new UpdateItemCommand(input);
    const insertItemResult: UpdateItemCommandOutput = await dbClient.send(command);
    const response: APIGatewayProxyResult = {
        statusCode: 204,
        body: JSON.stringify(insertItemResult)  
    }
    return response;
}