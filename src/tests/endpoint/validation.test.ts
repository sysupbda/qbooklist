import test from 'ava';

import { makeAppRequest } from '../fixtures/make-app-request';
import { validationExpressHandler } from '../../api/validation/validation-api.handler';
import { PasswordValidationError } from '../../validators/password.validator';

// supertest apparently cannot not send data as a test
test.skip('vaildation: Broken request', async t => {
    t.plan(2);

    const res = await makeAppRequest(validationRegistrar)
        .post('/validation');

    t.is(res.status, 400);
    t.is(res.body.err, 'bad_request');
});

test('password: Success', async t => {
    t.plan(3);

    const res = await makeAppRequest(validationRegistrar)
        .post('/validation')
        .send({email: 'ava@rocks.com', password: 'Sdhskjh349!'});

    t.is(res.error, false);
    t.is(res.status, 200);
    t.is(res.body.valid, true);
});

test('password: Failure', async t => {
    t.plan(3);

    const res = await makeAppRequest(validationRegistrar)
        .post('/validation')
        .send({newpassword: ''});

    t.is(res.status, 406);
    t.is(res.body.err, PasswordValidationError.TOO_SHORT);
    t.is(res.body.field, 'newpassword');
});

function validationRegistrar(app) {
    app.post('/validation', validationExpressHandler);
}