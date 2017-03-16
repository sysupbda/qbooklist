import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as request from 'supertest';

function makeApp(registrar) {
    const app = express();
    app.use(bodyParser.json());

    registrar(app);
    return app;
}

export function makeAppRequest(registrar) {
    return request(makeApp(registrar));
}