import * as crypto from 'crypto';
import { Config } from '../config';
import { getUserItem } from './redis/get-user-item';
import { listUserItems } from './redis/list-user-items';
import * as redis from 'redis';
import * as bluebird from 'bluebird';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

import { GenericList } from './interfaces/list.interface';
import { Book } from './interfaces/book.interface';
import { GenericStore, updateSuccess } from './interfaces/generic-store.interface';
import { createTempToken } from './redis/create-temp-token';
import { createNewUser } from './redis/create-new-user';
import { getUserHashId } from './redis/get-user-hashid';
import { encryptPassword } from '../operators/encrypt-password';
import { normalizeEmail } from '../operators/normalize-email';
import { TokenGenerator, tokenString } from './interfaces/token-generator';
import { NewUserAuthentification, UserAuthentification } from './interfaces/user.interface';
import { AuthentificationStore, hashIdString } from './interfaces/authentification-store.interface';


export class RedisStore implements AuthentificationStore, GenericStore<Book> {
    constructor(private tokenGenerator: TokenGenerator,
                private redisClient: redis.RedisClient) {}

    createNewUser(user: NewUserAuthentification): Promise<hashIdString> {
        return createNewUser(this.redisClient, user);
    }

    createTempToken(hashId: hashIdString): Promise<tokenString> {
        return createTempToken(this.tokenGenerator, this.redisClient, hashId);
    }

    getUserHashId(user: UserAuthentification): Promise<string> {
        return getUserHashId(this.redisClient, user);
    }

    list(key: string, property: string, offset: number, limit: number): Promise<GenericList<Book>> {
        return listUserItems(this.redisClient, key, property, offset, limit);
    }

    query(key: string, property: string, searchQuery: string, offset: number, limit: number): Promise<GenericList<Book>> {
        return this.list(key, property, offset, limit)
            .then(items => {
                return items.list.filter(item => item.json.indexOf(searchQuery) !== -1);
            })
            .then(bookList => {
                return {queryableCount: bookList.length, list: bookList};
            });
    }

    get(key: string, property: string, bookId: string): Promise<Book> {
        return getUserItem(this.redisClient, key, property, bookId);
    }

    set(key: string, property: string, item: Book): Promise<updateSuccess> {
        const userKey = `user:${key}:${property}`;
        const bookKey = `${property}:${key}:${item.id}`;
        return this.redisClient.multi()
                // I know.. HMSET right? Well this is so much more readable :)
                .HSET(bookKey, 'id', item.id)
                .HSET(bookKey, 'json', JSON.stringify(item.json))
                .SADD(userKey, item.id)
                .execAsync()
                .then(result => {
                    if (result) {
                        return result;
                    }
                    return Promise.reject({err: 'could_not_save'});
                });
    }

    delete(key: string, property: string, item: Book): Promise<updateSuccess> {
        const userKey = `user:${key}:${property}`;
        const bookKey = `${property}:${key}:${item.id}`;
        return this.redisClient.multi()
                .DEL(bookKey)
                .SREM(userKey, item.id)
                .execAsync()
                .then(result => {
                    if (result) {
                        return result;
                    }
                    return Promise.reject({err: 'key_does_not_exist'});
                });
    }

    hashIdForToken(token: tokenString): Promise<hashIdString> {
        if (Config.security.testUser.hashId && token === Config.security.testUser.dummyTokenSecret) {
            return Promise.resolve(Config.security.testUser.hashId);
        }
        let tokenToQuery = token;
        if (Config.security.saltAndHashTokens) {
            tokenToQuery = crypto.createHash('sha256').update(`kjhrejkh${tokenToQuery}`).digest('hex');
        }
        const newTokenKey = `token:${token}`;
        return this.redisClient.getAsync(newTokenKey)
            .then(hashId => {
                if (hashId) {
                    return hashId;
                }
                return Promise.reject({
                    err: 'token_not_valid'
                });
            });
    }

    static createRedisClient(): redis.RedisClient {
        const redisClient = redis.createClient();
        redisClient.on('ready', () => redisClient.select(1));
        return redisClient;
    }
}