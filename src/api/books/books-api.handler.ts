import { BookReadExpressHandler } from './bookread.handler';
import { LoadExpressHandler } from './bookload.handler';
import { Book } from '../../store/interfaces/book.interface';
import { GenericStore } from '../../store/interfaces/generic-store.interface';
import { BookListExpressHandler } from './booklist.handler';
import { UserAuthentification } from '../../store/interfaces/user.interface';
import { NewTokenResponse } from '../reponse/new-token-response';
import { AuthentificationStore } from '../../store';
import { BookWriteExpressHandler } from './bookwrite.handler';

export class BooksExpressHandler {

    constructor(private store: GenericStore<Book>) {}

    registerOnRouter(router) {
        const bookread = new BookReadExpressHandler(this.store);
        router.get('/:bookId', bookread.handler.bind(bookread));

        const bookwrite = new BookWriteExpressHandler(this.store);
        router.post('/', bookwrite.handler.bind(bookwrite));

        const bookLoader = new LoadExpressHandler(this.store);
        router.put('/', bookLoader.handler.bind(bookLoader));

        const booklist = new BookListExpressHandler(this.store);
        router.get('/', booklist.handler.bind(booklist));
        return router;
    }
}
