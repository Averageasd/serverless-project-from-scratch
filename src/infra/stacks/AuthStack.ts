import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthStack extends Stack {

    public userPool: UserPool;
    private userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
    }

    private createUserPool(): void {
        this.userPool = new UserPool(this, 'SpaceUserPool', {
            selfSignUpEnabled: true,
            signInAliases:{
                username: true,
                email: true
            }
        });
    }   

    private createUserPoolClient(): void {
        this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient',{
            authFlows:{
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        });
    }
}