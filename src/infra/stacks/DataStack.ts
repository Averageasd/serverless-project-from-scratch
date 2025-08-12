import { Stack, StackProps} from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DataStack extends Stack {

    public readonly spaceTable!: ITable;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        this.spaceTable = new Table(this, 'SpacesTable',{
            partitionKey:{
                name: 'id',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST, // On-Demand capacity mode

        });
    }
}