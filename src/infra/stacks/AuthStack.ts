import { Stack, StackProps } from "aws-cdk-lib";
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class AuthStack extends Stack {

    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unauthenticatedRole: Role;
    private adminRole: Role;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createIdentityPool();
        this.createRoles();
        this.attachRoles();
        this.createAdminsGroup();
    }

    private createUserPool(): void {
        this.userPool = new UserPool(this, 'SpaceUserPool', {
            selfSignUpEnabled: true,
            signInAliases:{
                username: true,
                email: true,
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

    private createAdminsGroup(): void {
        new CfnUserPoolGroup(this, 'SpaceAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',

            // make connection between group and role
            roleArn: this.adminRole.roleArn
        });
    }

    private createIdentityPool(): void {
        this.identityPool = new CfnIdentityPool(this, 'spaceIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        });
    }

    private createRoles(): void {
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity'
        )
        });

        this.authenticatedRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions:['*'],
                resources:['*']
            }
        ));

        this.unauthenticatedRole = new Role(this, 'CognitoDefaultUnAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity'
        )
        });
        
        this.adminRole = new Role(this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity'
        )
        });
    }

    private attachRoles(): void {
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles:{
                'authenticated':this.authenticatedRole.roleArn,
                'unauthenticated':this.unauthenticatedRole.roleArn,
            },
            roleMappings:{
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution:'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        });
    }

}