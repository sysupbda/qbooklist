import * as isemail from 'isemail';
import { Validator } from './validation.interface';
import { Config } from '../config';

const ISEMAILOPTIONS = {
    errorLevel: true
};

export class EmailValidationError {
    static INVALID_TOPOLOGY = 'invalid_topology';
    static NOT_RFC5322_COMPLIANT = 'not_rfc5322_compliant';
    static TIMEOUT = 'timeout';
}

export class EmailValidator implements Validator {
    validate(input: string): Promise<true> {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                reject({
                    err: EmailValidationError.TIMEOUT
                });
            }, Config.email.timeout);

            if (!input || input.length <= 3) {
                reject({
                    err: EmailValidationError.INVALID_TOPOLOGY
                });
            }

            isemail.validate(input, ISEMAILOPTIONS, this.handleIsEmailResponse(resolve, reject));
        });
    }

    handleIsEmailResponse(resolve, reject) {
        return result => {
            if (notRfc5322Compliant(result)) {
                reject({
                    err: EmailValidationError.NOT_RFC5322_COMPLIANT
                });
            } else {
                // If result is not 0, might not be 100% kosher,
                // but is kosher enough
                resolve(true);
            }
        };

        function notRfc5322Compliant(result) {
            return result >= isemail.diagnoses.rfc5322Domain;
        }
    }
}

