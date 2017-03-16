import { NewTokenResponse } from '../reponse/new-token-response';
import { validationExpressHandler } from '../validation/validation-api.handler';
import { passwordValidation } from '../validation/password.handler';
import { emailValidation } from '../validation/email.handler';
import { AuthentificationStore } from '../../store';

export class RegistrationExpressHandler {

    constructor(private store: AuthentificationStore) {}

    registerOnRouter(router) {
        router.post('/', this.handler.bind(this));
        return router;
    }

    handler(req, res) {
        try {
            if (!req.body || !req.body.newpassword || !req.body.email) {
                res.status(400)
                    .send({
                        err: 'bad_request',
                        url: req.originalUrl,
                        body: req.body,
                        type: 'registration'
                    });
                return;
            }
            this.registrationValidationHandler(req.body)
                .then(this.registerForToken(req.body))
                .then(token => {
                    const responder = new NewTokenResponse(token);
                    responder.updateHttpResponse(req, res);
                })
                .catch(err => res.status(406).send(err));
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }

    registrationValidationHandler(inputs) {
        return Promise.all([
            passwordValidation(inputs),
            emailValidation(inputs)
        ]);
    }

    registerForToken(validatedFields) {
        return (validatedPromises) => {
            return this.store.createNewUser(validatedFields)
                             .then(hashId => this.store.createTempToken(hashId));

        };
    }

}
