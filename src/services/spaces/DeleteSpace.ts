import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const {id} = event.pathParameters;
    const input: DeleteItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "id":{
                'S': id
            }
        },
        ConditionExpression: "attribute_exists(id)",
    };
    const deleteSpaceCommand: DeleteItemCommand = new DeleteItemCommand(input);
    await dbClient.send(deleteSpaceCommand);
    return {
            statusCode: 204,
        body: JSON.stringify('item deleted')  
    } as APIGatewayProxyResult
}