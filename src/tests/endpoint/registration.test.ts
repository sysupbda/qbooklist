import { test } from 'ava';

import { MockAuthStore } from '../fixtures/mock-auth-store';
import { makeAppRequest } from '../fixtures/make-app-request';
import { RegistrationExpressHandler } from '../../api/registration/registration-api.handler';
import { PasswordValidationError } from '../../validators/password.validator';


test.beforeEach(t => {
    t.context.store = new MockAuthStore();
    const handler = new RegistrationExpressHandler(t.context.store);
    t.context.appRequest = () => {
        return makeAppRequest(app =>
            app.post('/registration', handler.handler.bind(handler))
        );
    };
});

test('registration: Success', async t => {
    t.plan(2);

    t.context.store.fakeSuccess('kjhskfjhkjdhf');
    t.context.store.fakeSuccess('kjhskfjhkjdhf');
    const res = await t.context.appRequest()
        .post('/registration')
        .send({email: 'ava@rocks.com', newpassword: 'Sdhskjh349!'});

    t.is(res.error, false);
    t.is(res.status, 200);
});

test('registration: Failure', async t => {
    t.plan(2);

    t.context.store.fakeSuccess('kjhskfjhkjdhf');
    t.context.store.fakeSuccess('398743kjHjhdsa');
    const res = await t.context.appRequest()
        .post('/registration')
        .send({email: 'ava@rocks.com', newpassword: 'o'});

    t.is(res.status, 406);
    t.is(res.body.err, PasswordValidationError.TOO_SHORT);
});
