import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const item = JSON.parse(event.body);
    const id = v4();
    const input = {
        Item: {
            id: {
                S: id
            },
            location: {
                S: item.location
            }
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: process.env.TABLE_NAME
    } as PutItemCommandInput;

    const command: PutItemCommand = new PutItemCommand(input);
    const insertItemResult: PutItemCommandOutput = await dbClient.send(command);
    console.log(insertItemResult);
    const response: APIGatewayProxyResult = {
        statusCode: 201,
        body: JSON.stringify(id)  
    }
    return response;
}