import { NewUserAuthentification, UserAuthentification } from '../interfaces/user.interface';
import { normalizeEmail } from '../../operators/normalize-email';
import { encryptPassword } from '../../operators/encrypt-password';
import { hashIdString } from '../interfaces/authentification-store.interface';

export function getUserHashId(redisClient, user: UserAuthentification): Promise<hashIdString> {
    const hashId = normalizeEmail(user.email);
    const userKey = `user:${hashId}`;

    return redisClient.hgetAsync(userKey, 'password')
                      .then(validatePassword);

    function validatePassword(existingUserPassword): Promise<any> {
        if (!existingUserPassword || encryptPassword(hashId, user.password) !== existingUserPassword) {
            return Promise.reject({
                err: 'invalid_user_or_password'
            });
        }

        return Promise.resolve(hashId);
    }
}
