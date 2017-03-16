import { AuthentificationStore } from '../../store';
import { requestToken } from '../../operators/requestToken';

// Authentificator expects the cookie secret to be set and the query param token
export function authentificator(store: AuthentificationStore) {
    return (req, res, next) => {
        if (!req.query.token) {
            const error = {
                err: 'bad_request',
                url: req.originalUrl,
                type: 'authentification'
            };

            res.status(400)
               .send(error);
            next(error);
            return;
        }

        const completeToken = requestToken(req);
        store.hashIdForToken(completeToken)
             .then(hashId => req.userHashId = hashId)
             .then(() => next())
             .catch(err => {
                const error = {
                    err: 'not_authorized'
                };

                res.status(401)
                   .send(error);
                next(error);
             });
    };
}