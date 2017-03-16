export type tokenString = string;

export interface TokenGenerator {
    nextToken(): IterableIterator<tokenString>;
}


