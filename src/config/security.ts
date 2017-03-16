export class SecurityConfig {
    static saltAndHashTokens = true;
    static httpsOnlyCookies = true;
    static testUser = {
        dummyTokenSecret: 'testingdemoforshows',
        hashId: 'demo',
    };
}