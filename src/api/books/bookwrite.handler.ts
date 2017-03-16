import { Book } from '../../store/interfaces/book.interface';
import { GenericStore } from '../../store/interfaces/generic-store.interface';

export class BookWriteExpressHandler {

    constructor(private store: GenericStore<Book>) {}

    handler(req, res) {
        try {
            const userHashId = req.userHashId;

            if (!req.body.json || !req.body.id) {
                res.status(400).send({err: 'body_must_contain_id_and_json'});
                return;
            }
            this.store.set(userHashId, 'books', req.body)
                .then(() => res.status(200).send({valid: true}))
                .catch(err => {
                    if (err.message === 'error_sent') {
                        return;
                    }
                    process.stderr.write(`Error ${err.message} while saving book\n`);
                    res.status(422).send({err: 'book_invalid'});
                });
        } catch (e) {
            process.stderr.write(`Error within handler: ${e.message}\n`);
            res.status(500)
               .send('If you see this error too often, please contact the support');
        }
    }
}
