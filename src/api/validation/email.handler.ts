import { EmailValidator } from '../../validators/email.validator';

export function emailValidation (input) {
    if (typeof input.email === 'undefined') {
        return Promise.resolve(true);
    }

    const validator = new EmailValidator();
    return validator.validate(input.email)
                    .catch(err => {
                        const newError = {
                            ...err,
                            input: input.email,
                            field: 'email'
                        };
                        return Promise.reject(newError);
                    });
}