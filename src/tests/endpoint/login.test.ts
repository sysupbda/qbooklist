import { test } from 'ava';

import { MockAuthStore } from '../fixtures/mock-auth-store';
import { makeAppRequest } from '../fixtures/make-app-request';
import { LoginExpressHandler } from '../../api/login/login-api.handler';
import { PasswordValidationError } from '../../validators/password.validator';


test.beforeEach(t => {
    t.context.store = new MockAuthStore();
    const handler = new LoginExpressHandler(t.context.store);
    t.context.appRequest = () => {
        return makeAppRequest(app =>
            app.post('/login', handler.handler.bind(handler))
        );
    };
});

test('login: Success', async t => {
    t.plan(2);

    t.context.store.fakeSuccess('mockhashid');
    t.context.store.fakeSuccess('mocktoken');
    const res = await t.context.appRequest()
        .post('/login')
        .send({email: 'ava@rocks.com', password: 'Sdhskjh349!'});

    t.is(res.error, false);
    t.is(res.status, 200);
});

test('login: Failure', async t => {
    t.plan(2);

    t.context.store.fakeError({err: 'invalid_user_or_password'});
    const res = await t.context.appRequest()
        .post('/login')
        .send({email: 'ava@rocks.com', password: 'o'});

    t.is(res.status, 401);
    t.is(res.body.err, 'invalid_user_or_password');
});
