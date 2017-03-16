import * as crypto from 'crypto';

export function encryptPassword(email: string, plainText: string): string {
    // Adding the normalized email to the salt so that users with the same password
    // do not end up with the same hash

    const salted = `${plainText}dfdsfsfDSJKHkjhEf7po${email}sdhlhr(FHjkh34kjsdfsfsh3(*&ihfksjh#IY$`;
    return crypto.createHash('sha256').update(salted).digest('hex');
}