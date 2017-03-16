import test from 'ava';
import * as fakeredis from 'fakeredis';
import * as bluebird from 'bluebird';
bluebird.promisifyAll(fakeredis.RedisClient.prototype);
bluebird.promisifyAll(fakeredis.Multi.prototype);

import { createTempToken } from './create-temp-token';
import { MockTokenGenerator } from '../../tests/fixtures/mock-token-generator';

test.beforeEach(t => {
    t.context.redisClient = fakeredis.createClient();
    t.context.tokenGenerator = new MockTokenGenerator();
});

test('finds no previous token: Success', async t => {
    const mockHashId = 'orange@bpue.com';

    await createTempToken(t.context.tokenGenerator,
                          t.context.redisClient,
                          mockHashId);
});

test('finds previous user: Failure', async t => {
    const mockHashId = 'orange@ddde.com';
    t.context.redisClient
        .SET(`token:2`, 1);

    await createTempToken(t.context.tokenGenerator,
                          t.context.redisClient,
                          mockHashId)
                        .then(newUser => t.fail(`token already exists, should fail`))
                        .catch(err => t.pass());
});