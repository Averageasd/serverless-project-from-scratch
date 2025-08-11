import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context } from "aws-lambda";
import {v4} from 'uuid';
import {
    ListBucketsCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { DynamoDBClient, ListBackupsCommand, ListBackupsCommandOutput } from "@aws-sdk/client-dynamodb";
import { postSpace } from "./PostSpace";
import { getSpaces } from "./GetSpaces";

const client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    console.log(event);
    const command: ListBucketsCommand = new ListBucketsCommand({});
    const listBucketsResult: ListBackupsCommandOutput = await client.send(command);

    const dbClient = new DynamoDBClient({});
    let message: string;
    try{
        switch(event.httpMethod){
        case 'GET':
            return getSpaces(event, dbClient);
        case 'POST':
            return postSpace(event, dbClient);
        default:
            break;
        }
    }
    catch (error:any){
        return {
            statusCode: 500,
            body: JSON.stringify('internal error')
        }
    };

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(`action is ${message}`)
    }
    return response;
};

export {handler}