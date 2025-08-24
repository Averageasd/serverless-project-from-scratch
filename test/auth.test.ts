import { AuthService } from "./AuthService";

async function testAuth(){
    const service = new AuthService();
    const loginResult = await service.login(
        'ayoayo',
        'Afeoe1245@'
    );

    const idToken = await service.getIdToken();
    const credentials = await service.generateTemporaryCredentials();
}

testAuth();