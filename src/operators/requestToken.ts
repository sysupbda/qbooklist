import * as express from 'express';

export function requestToken(req: express.Request) {
    let cookiePart = req.cookies.secret;
    if (!cookiePart) { // Some test tools cannot set cookies
        cookiePart = '';
    }
    return joinTokens(cookiePart, req.query.token);
}

// This function helps be consistent about the order we validate the token concatenation
function joinTokens(cookieToken: string, queryToken: string) {
    return `${cookieToken}${queryToken}`;
}