import { tokenString } from '../../store/interfaces/token-generator';

let tokenNum = 0;

export class MockTokenGenerator {
    *nextToken(): IterableIterator<tokenString> {
        while (true) {
            tokenNum += 1;
            yield tokenNum.toString();
        }
    }
}