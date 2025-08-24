import { Amplify} from "aws-amplify";
import { SignInInput, SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = 'us-east-1';
Amplify.configure({
    Auth:{
        Cognito: {
            userPoolId:'us-east-1_13OprXwIG',
            userPoolClientId:'1oeph4jl9la4lk07pcq2gkh2h8',
            identityPoolId:'us-east-1:c3f74f29-61ef-4c61-9f1b-418b5ec38e43'
        }
    }
});

export class AuthService {

    // login using username and password
    public async login(userName: string, password: string): Promise<SignInOutput> {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });

        return signInOutput;
    }

    public async getIdToken(){
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken.toString();
    }

    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_13OprXwIG`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials:fromCognitoIdentityPool({
                identityPoolId:'us-east-1:c3f74f29-61ef-4c61-9f1b-418b5ec38e43',
                logins:{
                    [cognitoIdentityPool]:idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}