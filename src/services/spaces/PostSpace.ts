import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/Validator";

export async function postSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const item:any = JSON.parse(event.body);
    const id = v4();

    // field validation
    // if fails, throw error and catch errors
    // inside handler
    validateAsSpaceEntry({
        id: id,
        name: item.name,
        location: item.location,
        photoUrl: item.photoUrl
    });
    const input = {
        Item: {
            id: {
                S: id
            },
            location: {
                S: item.location
            },
            name: {
                S: item.name
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