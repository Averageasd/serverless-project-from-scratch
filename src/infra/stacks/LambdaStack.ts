import {Stack, StackProps} from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';


interface LambdaStackProp extends StackProps {
    spaceTable: ITable;
}
export class LambdaStack extends Stack {

    public readonly spacesLambdaIntegration!: LambdaIntegration;
    public readonly getSingleSpaceLambdaIntegration!: LambdaIntegration;
    public readonly updateSingleSpaceLambdaIntegration!: LambdaIntegration;
    public readonly deleteSpaceLambdaIntegration!: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProp){
        super(scope, id, props);

        const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        const getSingleSpaceLambda = new NodejsFunction(this, 'GetSingleSpaceLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'getSingleSpaceHandler',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'getSingleSpaceHandler.ts')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        const updateSingleSpaceLambda = new NodejsFunction(this, 'UpdateSingleSpaceLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'updateSingleSpaceHandler',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'updateSpaceHandler.ts')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        const deleteSpaceLambda = new NodejsFunction(this, 'DeleteSpaceLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'deleteSpaceHandler',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'deleteSpaceHandler.ts')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        spacesLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions:['*'],
                resources:['*']
            }
        ));

        getSingleSpaceLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions:['*'],
                resources:['*']
            }
        ));

        updateSingleSpaceLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions:['*'],
                resources:['*']
            }
        ));

        deleteSpaceLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions:['*'],
                resources:['*']
            }
        ));

        this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
        this.getSingleSpaceLambdaIntegration = new LambdaIntegration(getSingleSpaceLambda);
        this.updateSingleSpaceLambdaIntegration = new LambdaIntegration(updateSingleSpaceLambda);
        this.deleteSpaceLambdaIntegration = new LambdaIntegration(deleteSpaceLambda);
    }
}