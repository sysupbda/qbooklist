import { Config } from '../../config';
import * as express from 'express';

export class NewTokenResponse {
    cookiePortion: string;
    queryPortion: string;

    constructor(privateNewToken: string) {
        this.cookiePortion = privateNewToken.substring(0, 18);
        this.queryPortion = privateNewToken.substring(18);
    }

    updateHttpResponse(req: express.Request, res: express.Response) {
        res.status(200);
        const secretOptions: any = {
            httpOnly: true,
            domain: req.hostname,
            maxAge: Config.token.timeoutInSeconds * 1000
        };
        if (Config.security.httpsOnlyCookies) {
            secretOptions.secure = true;
        }
        res.cookie('secret', this.cookiePortion, secretOptions);
        res.send({
            token: this.queryPortion
        });
    }
}