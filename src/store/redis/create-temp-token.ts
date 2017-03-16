import * as crypto from 'crypto';
import { Config } from '../../config';
import { tokenString } from '../interfaces/token-generator';
import { NewUserAuthentification, UserAuthentification } from '../interfaces/user.interface';
import { normalizeEmail } from '../../operators/normalize-email';
import { encryptPassword } from '../../operators/encrypt-password';
import { hashIdString } from '../interfaces/authentification-store.interface';

export function createTempToken(tokenGenerator, redisClient, hashId: hashIdString): Promise<tokenString> {
    const token = generateUniqueToken();
    const tokenKey = `token:${token}`;

    redisClient.WATCH(tokenKey);
    return redisClient.getAsync(tokenKey)
                            .then(ensureUniqueness)
                            .then(save)
                            .then(assessWhetherSuccessful);

    function ensureUniqueness(existingToken: string): Promise<any> {
        if (existingToken) {
            let newToken = generateUniqueToken();
            const newTokenKey = `token:${token}`;

            redisClient.UNWATCH(existingToken);
            return redisClient.getAsync(newTokenKey)
                              .then(ensureUniqueness);
        }
        return Promise.resolve(existingToken);
    }

    function save() {
        let tokenToSave = tokenKey;
        if (Config.security.saltAndHashTokens) {
            tokenToSave = crypto.createHash('sha256').update(`kjhrejkh${tokenKey}`).digest('hex');
        }
        return redisClient.multi()
                          .SETEX(tokenToSave, Config.token.timeoutInSeconds, hashId)
                          .execAsync();
    }

    function assessWhetherSuccessful(redisResult): Promise<hashIdString> {
        if (redisResult.length) {
            return Promise.resolve(token);
        }
        return Promise.reject({
            err: 'race_condition'
        });
    }

    function generateUniqueToken(): string {
        return tokenGenerator.nextToken().next().value;
    }
}
