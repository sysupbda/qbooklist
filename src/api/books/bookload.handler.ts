import { GenericList } from '../../store/interfaces/list.interface';
import { Book } from '../../store/interfaces/book.interface';
import { GenericStore } from '../../store/interfaces/generic-store.interface';
import { ListResponse } from '../reponse/list-response';
import * as request from 'request';

const previouslyCachedKey = 'googleapicallcached';

export class LoadExpressHandler {

    constructor(private store: GenericStore<Book>) {}

    handler(req, res) {
        try {
            this.validateJSON(req, res)
                .catch(err => {
                    res.status(501).send({err: 'only_google_and_list_load_implemented'});
                    throw new Error('error_sent');
                })
                .then(this.fetchBooks.bind(this))
                .then(this.saveGoogleBooks.bind(this)(req.userHashId))
                .then(savedList => res.status(200).send({loaded: true, list: savedList}))
                .catch(err => {
                    if (err.message === 'error_sent') {
                        return;
                    }
                    process.stderr.write(`Error ${err.message} while loading books\n`);
                    res.status(422).send({err: 'could_not_load'});
                });
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }

    validateJSON(req, res): Promise<any> {
        if (req.body.source !== 'google' && req.body.source !== 'list') {
            process.stderr.write(`Received wrong ${req.body.source}\n`);
            return Promise.reject('only_google_and_list_load_implemented');
        }
        return Promise.resolve(req.body);
    }

    fetchBooks(json) {
        return new Promise((resolve, reject) => {
            if (json.source === 'list') {
                resolve(json.list);
                return;
            }

            request.get('https://www.googleapis.com/books/v1/volumes?q=Quantum%20Ph', handleResponse);

            function handleResponse(err, response, body): void {
                if (err) {
                    reject(err);
                    return;
                }

                let fetchedBooks = JSON.parse(body);
                let toSave = [];

                if (fetchedBooks.totalItems) {
                    toSave = fetchedBooks.items.map(item => Object.assign({}, {
                        id: item.id,
                        json: JSON.stringify(item)
                    }));
                }

                resolve(toSave);
            }
        });
    }

    saveGoogleBooks(userHashId) {
        return (books: Book[]) => {
            // Could be optimized by creating a single pipelined batch,
            // but let's prefer to simply share the code of the add handler
            for (let book of books) {
                this.store.set(userHashId, 'books', book);
            }

            return books;
        };
    };
}
