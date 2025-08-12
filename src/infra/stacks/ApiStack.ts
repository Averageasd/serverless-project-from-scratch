import {Stack, StackProps} from 'aws-cdk-lib';
import { LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
    getSingleSpaceLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps){
        super(scope, id, props);

        const paths = [
            {
                path: '',
                method : 'GET',
                lambda: props.spacesLambdaIntegration
            },
            {
                path: '',
                method: 'POST',
                lambda: props.spacesLambdaIntegration
            },
            {
                path: '{id}',
                method: 'GET',
                lambda: props.getSingleSpaceLambdaIntegration
            }
        ]

        // represent api group
        const api = new RestApi(this, 'SpaceApi');

        const rootRes: Resource = api.root.addResource('spaces');

        for (const pathPair of paths) {
            let apiPath: Resource = pathPair.path === '' ? rootRes : rootRes.addResource(pathPair.path);
            apiPath.addMethod(pathPair.method, pathPair.lambda);
        }
    }

    //     rootRes.addMethod('GET', props.spacesLambdaIntegration);
    //     rootRes.addMethod('POST', props.spacesLambdaIntegration);
    // }
}