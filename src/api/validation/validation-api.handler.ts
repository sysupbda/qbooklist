import { passwordValidation } from './password.handler';
import { emailValidation } from './email.handler';

export function registerOnRouter(router) {
    router.post('/', validationExpressHandler);
    return router;
}

export function validationExpressHandler(req, res) {
    try {
        if (!req.body) {
            res.status(400)
                .send({
                    err: 'bad_request',
                    url: req.originalUrl,
                    body: req.body,
                    type: 'validation'
                });
            return;
        }
        validationHandler(req.body)
            .then(valid => Object.assign({}, {valid: true}))
            .then(valid => res.status(200).send(valid))
            .catch(err => res.status(406).send(err));
    } catch (e) {
        process.stderr.write(`Error within handler: ${e.message}\n`);
        res.status(500)
           .send('If you see this error too often, please contact the support');
    }
}

function validationHandler(inputs) {
    return Promise.all([
        passwordValidation(inputs),
        emailValidation(inputs)
    ]);
}