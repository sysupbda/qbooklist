import { hashIdString } from '../../store/interfaces/authentification-store.interface';
import { NewUserAuthentification, UserAuthentification } from '../../store/interfaces/user.interface';

import { AuthentificationStore } from '../../store';

export class MockAuthStore implements AuthentificationStore {
    response: any[] = [];
    success = true;

    fakeSuccess(newResponse: any) {
        this.success = true;
        this.response.push(newResponse);
    }

    fakeError(newResponse: any) {
        this.success = false;
        this.response.push(newResponse);
    }

    createNewUser(user: NewUserAuthentification): Promise<hashIdString> {
        return this.mockAnswer();
    }

    createTempToken(hashId: string): Promise<string> {
        return this.mockAnswer();
    }

    public getUserHashId(user: UserAuthentification): Promise<hashIdString> {
        return this.mockAnswer();
    }

    hashIdForToken(token: string): Promise<string> {
        return this.mockAnswer();
    }

    mockAnswer() {
        if (this.success) {
            return Promise.resolve(this.response.shift());
        }
        return Promise.reject(this.response.shift());
    }
}
