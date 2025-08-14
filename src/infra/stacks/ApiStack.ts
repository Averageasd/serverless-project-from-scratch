import {IResource, Stack, StackProps} from 'aws-cdk-lib';
import { LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';



interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
    getSingleSpaceLambdaIntegration: LambdaIntegration;
    updateSingleSpaceLambdaIntegration: LambdaIntegration;
}

interface Api {
    path: string,
    methods: string[],
    lambdas: LambdaIntegration[]
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps){
        super(scope, id, props);

        const spaceApiPaths: Api[] = [
            {
                path: '',
                methods : ['GET', 'POST'],
                lambdas: [props.spacesLambdaIntegration, props.spacesLambdaIntegration]
            },
            {
                path: '{id}',
                methods: ['GET', 'PUT'],
                lambdas: [props.getSingleSpaceLambdaIntegration, props.updateSingleSpaceLambdaIntegration]
            },
        ]

        // represent api group
        const spaceApi = new RestApi(this, 'SpaceApi');
        const spaceRootResource = spaceApi.root.addResource('spaces');
        this.setupApi(spaceRootResource, spaceApiPaths);
    }

    setupApi(rootResource: Resource, paths: Api[]): void {
        for (const pathPair of paths) {
            const pathSegments = pathPair.path.split('/');
            let apiPath: Resource = rootResource;
            this.buildPathHelper(apiPath, pathPair, pathSegments);
        }
    }

    buildPathHelper(apiPath: Resource, pathSetup: Api, segments: string[]) : void {
        for (const segment of segments){
            if (apiPath.getResource(segment) || segment.trim() === ''){
                continue;
            }
            apiPath = apiPath.addResource(segment);
        }

        console.log(apiPath.path);
        
        for (let i = 0; i < pathSetup.methods.length;i++){
            apiPath.addMethod(pathSetup.methods[i], pathSetup.lambdas[i]);
        }
    }
}