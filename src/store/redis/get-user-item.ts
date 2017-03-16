export function getUserItem<T>(redisClient, key: string, property: string, bookId: string): Promise<T> {
    const bookKey = `${property}:${key}:${bookId}`;

    return redisClient.hgetAsync(bookKey, 'json')
        .then(json => {
            if (json) {
                return json;
            }
            return Promise.reject({
                err: 'item_not_found'
            });
        });
}
