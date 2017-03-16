import { ValidationError } from '../../validators/validation.interface';

export function expectValidationFailure(t, input, Validator, error) {
    const validator = new Validator();

    const validationPromise = validator.validate(input);
    validationPromise
             .then(valid => {
                 t.fail('was not rejected');
             })
             .catch((caught: ValidationError) => {
                 t.is(caught.err, error);
             });
}