export function normalizeEmail(email: string): string {
    // In theory the front part of the email can be case sensitive
    // In practice it is just likely to be used to abuse us
    // as most MX servers are setup to be case insensitive

    return email.toLowerCase();
}