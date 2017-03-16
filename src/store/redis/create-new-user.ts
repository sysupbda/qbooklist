import { NewUserAuthentification, UserAuthentification } from '../interfaces/user.interface';
import { normalizeEmail } from '../../operators/normalize-email';
import { encryptPassword } from '../../operators/encrypt-password';
import { hashIdString } from '../interfaces/authentification-store.interface';

export function createNewUser(redisClient, user: NewUserAuthentification): Promise<hashIdString> {
    const hashId = normalizeEmail(user.email);
    const userKey = `user:${hashId}`;

    redisClient.WATCH(userKey);
    return redisClient.hgetAsync(userKey, 'originalEmail')
                            .then(storeUser)
                            .then(assessWhetherSuccessful);

    function storeUser(existingUser): Promise<any> {
        if (existingUser) {
            return Promise.reject({
                err: 'user_already_existed'
            });
        }
        return redisClient.multi()
                          .HSET(userKey, 'originalEmail', user.email)
                          .HSET(userKey, 'password', encryptPassword(hashId, user.newpassword))
                          .execAsync();
    }

    function assessWhetherSuccessful(redisResult): Promise<hashIdString> {
        if (redisResult.length) {
            return Promise.resolve(hashId);
        }
        return Promise.reject({
            err: 'user_already_existed'
        });
    }
}
