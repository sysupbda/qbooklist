import {EmailValidationConfig} from './email-validation.config';
import {PasswordValidationConfig} from './password-validation.config';
import {TokenValidationConfig} from './token-validation.config';
import {SecurityConfig} from './security';

export class Config {
    static email = EmailValidationConfig;
    static password = PasswordValidationConfig;
    static token = TokenValidationConfig;
    static security = SecurityConfig;
};