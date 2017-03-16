import { tokenString } from './token-generator';
import { NewUserAuthentification, User, UserAuthentification } from './user.interface';

export type hashIdString = tokenString;

export interface AuthentificationStore {
    createNewUser(user: NewUserAuthentification): Promise<hashIdString>;

    getUserHashId(user: UserAuthentification): Promise<hashIdString>;
    createTempToken(hashId: hashIdString): Promise<tokenString>;

    hashIdForToken(token: tokenString): Promise<hashIdString>;
}