import { PasswordValidator } from '../../validators/password.validator';

export function passwordValidation (input) {
    if (typeof input.newpassword === 'undefined') {
        return Promise.resolve(true);
    }

    const validator = new PasswordValidator();
    return validator.validate(input.newpassword)
                    .catch(err => {
                        const newError = {
                            ...err,
                            input: input.newpassword,
                            field: 'newpassword'
                        };
                        return Promise.reject(newError);
                    });
}