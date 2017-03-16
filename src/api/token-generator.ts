import { TokenGenerator, tokenString } from '../store/interfaces/token-generator';
import * as uuid from 'uuid/v4';

export class RandomTokenGenerator implements TokenGenerator {
    *nextToken(): IterableIterator<tokenString> {
        while (true) {
            yield uuid();
        }
    }
}
