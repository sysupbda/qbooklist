import { GenericList } from '../interfaces/list.interface';
export function listUserItems<T>(redisClient, key: string, property: string, offset: number, limit: number): Promise<GenericList<T>> {
    const userKey = `user:${key}:${property}`;
    const bookKeyPrefix = `${property}:${key}`;
    let queryableCount = 0;

    return redisClient.smembersAsync(userKey)
        .then(books => {
            if (books && books.length) {
                queryableCount = books.length;
                const filtered = books.slice(offset, offset + limit);
                return filtered;
            }
            return Promise.reject({
                err: 'no_books_found'
            });
        })
        .then(books => { // List commands into a single batch for pipelining
            let batch = redisClient.batch();
            for (let bookId of books) {
                const bookKey = `${bookKeyPrefix}:${bookId}`;
                batch.HGET(bookKey, 'json');
            }
            return {books, batch};
        })
        .then(bookCommands => {
            return bookCommands.batch.execAsync()
                .then(bookDetails => {
                    return bookCommands.books.map((bookId, idx) => {
                        return {id: bookId, json: bookDetails[idx]};
                    });
                });
        })
        .then(bookList => {
            return {queryableCount, list: bookList};
        });
}
