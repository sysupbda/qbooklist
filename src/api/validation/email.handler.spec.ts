import test from 'ava';
import { emailValidation } from './email.handler';

test('expect error on empty email', async t => {
    t.plan(1);

    const input = {
        email: ''
    };
    await emailValidation(input)
        .then(success => t.fail())
        .catch(error => t.pass());
});

test('expect success on valid password', async t => {
    const input = {
        email: 'ben@dadsetan.com'
    };

    t.is(await emailValidation(input), true);
});
