import { DynamoDBClient, ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
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

    if (result.Items){
        const unmarshalledSpace: Record<string,any>
        = result.Items.map(item => unmarshall(item))[0];
        return {
             statusCode: 200,
            body: JSON.stringify(unmarshalledSpace)  
        } as APIGatewayProxyResult
    }

    return {
             statusCode: 404,
            body: JSON.stringify(`Space with id ${id} not found!`)  
        } as APIGatewayProxyResult
}