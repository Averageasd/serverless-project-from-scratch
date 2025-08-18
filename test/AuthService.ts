import { Amplify} from "aws-amplify";
import { SignInInput, SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";

Amplify.configure({
    Auth:{
        Cognito: {
            userPoolId:'us-east-1_13OprXwIG',
            userPoolClientId:'1oeph4jl9la4lk07pcq2gkh2h8'
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
}