import { Stack, StackProps} from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';

export class DataStack extends Stack {

    public readonly spaceTable!: ITable;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        this.spaceTable = new Table(this, 'SpacesTable',{
            partitionKey:{
                name: 'id',
                type: AttributeType.STRING
            }
        });
    }
}