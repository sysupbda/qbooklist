import { ValidationError } from '../../validators/validation.interface';

export async function asyncExpectValidationFailure(t, input, Validator, error) {
    t.plan(1);

    const validator = new Validator();

    const validationPromise = validator.validate(input);
    await validationPromise
             .then(valid => {
                 t.fail('was not rejected');
             })
             .catch((caught: ValidationError) => {
                 t.is(caught.err, error);
             });
}