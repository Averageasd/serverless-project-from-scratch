import { Stack, StackProps } from 'aws-cdk-lib';
import { 
    AuthorizationType, 
    CognitoUserPoolsAuthorizer, 
    Cors, 
    LambdaIntegration,
    MethodOptions, 
    Resource, 
    ResourceOptions, 
    RestApi } 
    from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';



interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
    getSingleSpaceLambdaIntegration: LambdaIntegration;
    updateSingleSpaceLambdaIntegration: LambdaIntegration;
    deleteSpaceLambdaIntegration: LambdaIntegration;
    userPool: IUserPool;
    
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
                methods : [
                    'GET', 
                    'POST'],
                lambdas: [
                    props.spacesLambdaIntegration, 
                    props.spacesLambdaIntegration]
            },
            {
                path: '{id}',
                methods: [
                    'GET', 
                    'PUT', 
                    'DELETE'
                ],
                lambdas: [
                    props.getSingleSpaceLambdaIntegration, 
                    props.updateSingleSpaceLambdaIntegration, 
                    props.deleteSpaceLambdaIntegration
                ]
            },
        ]

        // represent api group
        const spaceApi = new RestApi(this, 'SpaceApi');
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer',{
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(spaceApi);
        
        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        };

        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        const spaceRootResource = spaceApi.root.addResource('spaces', optionsWithCors);
        this.setupApi(spaceRootResource, spaceApiPaths, optionsWithAuth);
    }

    setupApi(rootResource: Resource, paths: Api[], optionsWithAuth: MethodOptions): void {
        for (const pathPair of paths) {
            const pathSegments = pathPair.path.split('/');
            let apiPath: Resource = rootResource;
            this.buildPathHelper(apiPath, pathPair, pathSegments, optionsWithAuth);
        }
    }

    buildPathHelper(apiPath: Resource, pathSetup: Api, segments: string[], optionsWithAuth: MethodOptions) : void {
        for (const segment of segments){
            if (apiPath.getResource(segment) || segment.trim() === ''){
                continue;
            }
            apiPath = apiPath.addResource(segment);
        }

        console.log(apiPath.path);
        
        for (let i = 0; i < pathSetup.methods.length;i++){
            apiPath.addMethod(pathSetup.methods[i], pathSetup.lambdas[i], optionsWithAuth);
        }
    }
}