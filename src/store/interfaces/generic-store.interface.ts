import { GenericList } from './list.interface';
export type updateSuccess = boolean;

export interface GenericStore<T> {
    list(key: string, property: string, offset?: number, limit?: number): Promise<GenericList<T>>;
    query(key: string, property: string, searchQuery: string, offset?: number, limit?: number): Promise<GenericList<T>>;
    get(key: string, property: string, bookId: string): Promise<T>;
    set(key: string, property: string, item: T): Promise<updateSuccess>;
    delete(key: string, property: string, item: T): Promise<updateSuccess>;
}