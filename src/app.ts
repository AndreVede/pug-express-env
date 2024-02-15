import * as path from 'path';
import * as express from 'express';
import { Express } from 'express';
import routerView from './views/router';

const app: Express = express();

app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set views route
app.use('/', routerView);

export default app;
