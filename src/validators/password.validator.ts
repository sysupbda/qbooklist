import * as isemail from 'isemail';
import { Validator } from './validation.interface';
import { Config } from '../config';

const ISEMAILOPTIONS = {
    errorLevel: true
};

export class PasswordValidationError {
    static TOO_SHORT = 'too_short';
    static TOO_MUCH_REPETITION = 'too_much_repetition';
    static MUST_BE_ALPHANUM_WITH_SPECIAL = 'must_be_alphanum_with_special';
    static TIMEOUT = 'timeout';
}

export class PasswordValidator implements Validator {
    validate(input: string): Promise<true> {
        if (input.length < Config.password.minimumLength) {
            return Promise.reject({err: PasswordValidationError.TOO_SHORT});
        }

        const repetitionRegex = new RegExp(Config.password.HASREPETITIONREGEXP);
        if (repetitionRegex.test(input)) {
            return Promise.reject({err: PasswordValidationError.TOO_MUCH_REPETITION});
        }

        const strongPasswordRegex = new RegExp(Config.password.STRONGPASSWORDREGEXP);
        if (!strongPasswordRegex.test(input)) {
            return Promise.reject({err: PasswordValidationError.MUST_BE_ALPHANUM_WITH_SPECIAL});
        }

        return Promise.resolve(true);
    }
}