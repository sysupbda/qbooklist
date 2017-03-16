import { GenericList } from '../../store/interfaces/list.interface';
import { Book } from '../../store/interfaces/book.interface';
import { GenericStore } from '../../store/interfaces/generic-store.interface';
import { ListResponse } from '../reponse/list-response';

export class BookListExpressHandler {

    constructor(private store: GenericStore<Book>) {}

    handler(req, res) {
        try {
            let {query, offset, limit} = req.params;
            offset = resolveOffset(req.params);
            limit = getLimit(req.params);

            let results;
            if (query) {
                results = this.store.query(req.userHashId, 'books',
                                           query.substring(0, 50),
                                           offset,
                                           limit);
            } else {
                results = this.store.list(req.userHashId, 'books', offset, limit);
            }

            return results.then(booklist => {
                                    const responder = new ListResponse(res);
                                    responder.useList(booklist, 'books');
                                })
                          .catch(err => res.status(404).send(err));
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }
}

function resolveOffset(params: any) {
    let offset = 0;
    if (params.offset) {
        offset = params.offset;
    }
    return offset;
}

function getLimit(params: any) {
    let limit = 20;
    if (params.limit) {
        limit = params.limit;
    }
    if (params.limit > 500) {
        limit = 500;
    }

    return limit;
}