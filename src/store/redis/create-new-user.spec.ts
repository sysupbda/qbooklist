import test from 'ava';
import * as fakeredis from 'fakeredis';
import * as bluebird from 'bluebird';
bluebird.promisifyAll(fakeredis.RedisClient.prototype);
bluebird.promisifyAll(fakeredis.Multi.prototype);

import { createNewUser } from './create-new-user';

test.beforeEach(t => {
    t.context.redisClient = fakeredis.createClient();
});

test('finds no previous user: Success', async t => {
    const mockUser = {
        email: 'orange@blue.com',
        newpassword: 'bubbles'
    };

    await createNewUser(t.context.redisClient,
                        mockUser);
});

test('finds previous user: Failure', async t => {
    t.context.redisClient
        .HSET('user:orange@blue.com', 'originalEmail', 'orange@blue.com',
                                      'password', 'bubbles');

    const mockUser = {
        email: 'orange@blue.com',
        newpassword: 'bubbles'
    };

    await createNewUser(t.context.redisClient,
                        mockUser)
                        .then(newUser => t.fail('user already exists, should fail'))
                        .catch(err => t.pass());
});