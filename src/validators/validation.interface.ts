export interface Validator {
    validate (input: string): Promise<true>;
}

export interface ValidationError {
    err: string;
    userReadableError?: string;
    userSuggestion?: string;
}