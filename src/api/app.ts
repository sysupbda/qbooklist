import { Book } from '../store/interfaces/book.interface';
import { resolve } from 'url';
import { BooksExpressHandler } from './books';
import { authentificator } from './middleware/authentificator';
import * as express from 'express';
import request from 'request';

import { RandomTokenGenerator } from './token-generator';
import { TokenGenerator } from '../store/interfaces/token-generator';
import { RedisStore } from '../store/redis-store';

import { RegistrationExpressHandler } from './registration';
import { LoginExpressHandler } from './login';
import { registerOnRouter as validationHandler } from './validation';

export class BookListApplication {
    store: RedisStore;
    tokenGenerator: TokenGenerator;

    constructor() {
        this.tokenGenerator = new RandomTokenGenerator();
        const redisClient = RedisStore.createRedisClient();
        this.store = new RedisStore(this.tokenGenerator, redisClient);
    }

    registerRoutes(app) {
        app.use('/validation', validationHandler(new express.Router()));

        const registrationHandler = new RegistrationExpressHandler(this.store);
        app.use('/registration', registrationHandler.registerOnRouter(express.Router()));

        const loginHandler = new LoginExpressHandler(this.store);
        app.use('/login', loginHandler.registerOnRouter(new express.Router()));

        const booksHandler = new BooksExpressHandler(this.store);
        app.use('/books', booksHandler.registerOnRouter(new express.Router().use(authentificator(this.store))));
    }
}

