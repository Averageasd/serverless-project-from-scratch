import { AuthService } from "./AuthService";

async function testAuth(){
    const service = new AuthService();
    const loginResult = await service.login(
        'ngking',
        'PhoneQuery9497@'
    );

    const idToken = await service.getIdToken();
}

testAuth();