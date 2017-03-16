import test from 'ava';

import { asyncExpectValidationFailure } from '../tests/fixtures/async-expect-validation-failure';
import { ValidationError } from './validation.interface';
import { EmailValidator, EmailValidationError } from './email.validator';

test('rejects an empty email with the invalid_topology error', async (t) => {
    const input = '';
    asyncExpectValidationFailure(t, input, EmailValidator, EmailValidationError.INVALID_TOPOLOGY);
});

test('rejects invalid characters with the invalid_topology error', async (t) => {
    const input = '#';
    asyncExpectValidationFailure(t, input, EmailValidator, EmailValidationError.INVALID_TOPOLOGY);
});

test('rejects valid characters that cannot be an email with the invalid_topology error', async (t) => {
    const input = 's@';
    asyncExpectValidationFailure(t, input, EmailValidator, EmailValidationError.INVALID_TOPOLOGY);
});

test('rejects input with invalid domain with the invalid_topology error', async (t) => {
    const input = 's@orange.com-';
    asyncExpectValidationFailure(t, input, EmailValidator, EmailValidationError.NOT_RFC5322_COMPLIANT);
});

test('accepts valid email address', async (t) => {
    const input = 'ben@dadsetan.com';

    const validator = new EmailValidator();
    t.is(await validator.validate(input), true);
});
