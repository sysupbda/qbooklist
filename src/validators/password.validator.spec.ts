import test from 'ava';

import { expectValidationFailure } from '../tests/fixtures/expect-validation-failure';
import { PasswordValidator, PasswordValidationError } from './password.validator';

test('rejects an empty password with too short error', async (t) => {
    const input = '';
    expectValidationFailure(t, input, PasswordValidator, PasswordValidationError.TOO_SHORT);
});

test('rejects characters repeated more than twice with too much repetition error', async (t) => {
    const input = 'aaa12345678';
    expectValidationFailure(t, input, PasswordValidator, PasswordValidationError.TOO_MUCH_REPETITION);
});

test('rejects characters repeated more than twice in the middle of input with too much repetition error', async (t) => {
    const input = '1234ffff5678';
    expectValidationFailure(t, input, PasswordValidator, PasswordValidationError.TOO_MUCH_REPETITION);
});

test('rejects weak topology with too much must be alphanum with special error', async (t) => {
    const input = 'abcdefghij';
    expectValidationFailure(t, input, PasswordValidator, PasswordValidationError.MUST_BE_ALPHANUM_WITH_SPECIAL);
});

test('accepts complex password', async (t) => {
    const input = 'ab235!cdefghij';
    expectValidationFailure(t, input, PasswordValidator, PasswordValidationError.MUST_BE_ALPHANUM_WITH_SPECIAL);
});