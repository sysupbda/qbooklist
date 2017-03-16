import { Book } from '../../store/interfaces/book.interface';
import { GenericStore } from '../../store/interfaces/generic-store.interface';

export class BookReadExpressHandler {

    constructor(private store: GenericStore<Book>) {}

    handler(req, res) {
        try {
            const userHashId = req.userHashId;
            this.store.get(userHashId, 'books', req.params.bookId)
                      .then(book => res.status(200).send(book))
                      .catch(err => {
                          res.status(404).send({err: 'no_book_found'});
                      });
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }

    loadJSONFromBody(req) {
        return new Promise((resolve) => {
            // If there is a JSON parsing error, an exception will be thrown and
            // this will be rejected by itself
            resolve(JSON.parse(req.body));
        });
    }
}
