import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";

const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    spaceTable: dataStack.spaceTable
});
const authStack = new AuthStack(app, 'AuthStack');
new ApiStack(app, 'ApiStack', {
    spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
    getSingleSpaceLambdaIntegration: lambdaStack.getSingleSpaceLambdaIntegration,
    updateSingleSpaceLambdaIntegration: lambdaStack.updateSingleSpaceLambdaIntegration,
    deleteSpaceLambdaIntegration : lambdaStack.deleteSpaceLambdaIntegration,
    userPool: authStack.userPool
});
