import test from 'ava';
import { passwordValidation } from './password.handler';

test('expect error on empty password', async t => {
    t.plan(1);

    const input = {
        newpassword: ''
    };
    await passwordValidation(input)
        .then(success => t.fail())
        .catch(error => t.pass());
});

test('expect success on valid password', async t => {
    const input = {
        newpassword: 'dsfsd34!Sd'
    };

    t.is(await passwordValidation(input), true);
});
