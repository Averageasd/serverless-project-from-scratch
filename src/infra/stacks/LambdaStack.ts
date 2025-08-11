import {Stack, StackProps} from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProp extends StackProps {
    spaceTable: ITable;
}
export class LambdaStack extends Stack {

    public readonly helloLambdaIntegration!: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProp){
        super(scope, id, props);

        const helloLambda = new Function(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'hello.main',
            code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
    }
}