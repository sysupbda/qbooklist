import { registerOffTheShelfMiddleware } from './middleware/off-the-shelve';
import * as express from 'express';
import * as path from 'path';
import { BookListApplication } from './app';

makeApp()
    .listen(3000, function () {
        process.stdout.write('Booklist app listening on port 3000!\n\n');
    });

function makeApp() {
    const app = express();
    registerOffTheShelfMiddleware(app);
    app.use('/static', express.static(path.join(__dirname, '..', '..', 'static')));

    const bookApp = new BookListApplication();
    bookApp.registerRoutes(app);

    return app;
}
