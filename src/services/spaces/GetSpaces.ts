import { DynamoDBClient, ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const statement = `SELECT * FROM "${process.env.TABLE_NAME}"`;
    const params = {
        Statement: statement
    };
    const getSpacesCommand = new ExecuteStatementCommand(params);
    const result = await dbClient.send(getSpacesCommand);
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(result.Items)  
    }
    console.log(response);
    return response;
}