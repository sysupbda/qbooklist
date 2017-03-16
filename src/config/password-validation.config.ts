export class PasswordValidationConfig {
    static minimumLength = 10;
    static STRONGPASSWORDREGEXP = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])';
    static HASREPETITIONREGEXP = '(.)\\1\\1';
}