import { DynamoDBClient, ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import { Parameter } from "aws-cdk-lib/aws-appconfig";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSingleSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const {id} = event.pathParameters;
    const statement = `SELECT * FROM "${process.env.TABLE_NAME}" WHERE id = ?`;
    const params = {
        Statement: statement,
        Parameters: [
            {
                'S': id
            }
        ]
    };
    const getSingleSpaceCommand = new ExecuteStatementCommand(params);
    const result = await dbClient.send(getSingleSpaceCommand);
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(result.Items)  
    }
    return response;
}