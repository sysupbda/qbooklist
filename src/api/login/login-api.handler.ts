import { UserAuthentification } from '../../store/interfaces/user.interface';
import { NewTokenResponse } from '../reponse/new-token-response';
import { AuthentificationStore } from '../../store';

export class LoginExpressHandler {
    constructor(private store: AuthentificationStore) {}

    registerOnRouter(router) {
        router.post('/', this.handler.bind(this));
        return router;
    }

    handler(req, res) {
        try {
            if (!req.body || !req.body.password || !req.body.email) {
                res.status(400)
                    .send({
                        err: 'bad_request',
                        url: req.originalUrl,
                        body: req.body,
                        type: 'login'
                    });
                return;
            }
            this.loginForToken(req.body)
                .then(token => {
                    const responder = new NewTokenResponse(token);
                    responder.updateHttpResponse(req, res);
                })
                .catch(err => res.status(401).send(err));
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }

    loginForToken(loginParameters: UserAuthentification) {
        return this.store.getUserHashId(loginParameters)
                            .then(hashId => this.store.createTempToken(hashId));
    }
}
