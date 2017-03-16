import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

export function registerOffTheShelfMiddleware(app: express.app) {
    app.use(bodyParser.json());
    app.use(cookieParser());

    // CORS Headers
    app.all('/*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });
}