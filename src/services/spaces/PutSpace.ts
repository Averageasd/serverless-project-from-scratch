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

export async function putSpace (
    event: APIGatewayProxyEvent, 
    dbClient: DynamoDBClient): 
    Promise<APIGatewayProxyResult>{

    const item = JSON.parse(event.body);
    console.log(item);
    console.log(item.location);
    const {id} = event.pathParameters;
    console.log('current id of space want to update ', id);
    const input: UpdateItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "id":{
                S: id
            },
        },
        ExpressionAttributeNames : {
            '#location' : "location"
        },
        ExpressionAttributeValues: {
            ':newLocation': {S: item.location}
        },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW",
        UpdateExpression:
            'set #location = :newLocation',  
    };
    const command: UpdateItemCommand = new UpdateItemCommand(input);
    const insertItemResult: UpdateItemCommandOutput = await dbClient.send(command);
    const response: APIGatewayProxyResult = {
        statusCode: 204,
        body: JSON.stringify(insertItemResult)  
    }
    return response;
}