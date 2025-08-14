import { DynamoDBClient, ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const statement = `SELECT * FROM "${process.env.TABLE_NAME}"`;
    const params = {
        Statement: statement
    };
    const getSpacesCommand = new ExecuteStatementCommand(params);
    const result = await dbClient.send(getSpacesCommand);
    const unmarshallSpaces: Record<string, any>[] = result.Items.map(item => unmarshall(item));
    return {
        statusCode: 200,
        body: JSON.stringify(unmarshallSpaces)
    } as APIGatewayProxyResult;
}