import { Express } from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import app from '@src/app';

export default class Server {
    private port: any;
    private app: Express = app;

    private server:
        | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
        | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

    constructor() {
        this.port = this.normalizePort(process.env.PORT || '3000');

        this.setServer();
    }

    private normalizePort(val: any): any {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    private errorHandler(error: any) {
        console.log(error);
        if (error.syscall !== 'listen') {
            throw error;
        }
        const address = this.server.address();
        const bind =
            typeof address === 'string'
                ? 'pipe ' + address
                : 'port: ' + this.port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges.');
                process.exit(1);
            //break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use.');
                process.exit(1);
            //break;
            default:
                throw error;
        }
    }

    private setAppExpress() {
        this.app.set('port', this.port);
    }

    private setServer() {
        this.setAppExpress();

        this.server = this.checkHttpsConfig
            ? https.createServer(
                  {
                      key: fs.readFileSync('selfsigned.key'),
                      cert: fs.readFileSync('selfsigned.crt'),
                  },
                  this.app
              )
            : http.createServer(this.app);

        this.server.on('error', this.errorHandler);

        this.server.on('listening', () => {
            const address = this.server.address();
            const bind =
                typeof address === 'string'
                    ? 'pipe ' + address
                    : 'port ' + this.port;
            console.log('Listening on ' + bind);
        });
    }

    public listen() {
        this.server.listen(this.port);
    }

    /**
     * Traite la configuration https et vérifie sa conformité si elle vient d'une variable d'environnement
     * @returns
     */
    private checkHttpsConfig(): boolean {
        const value = process.env.PROTOCOL || 'HTTP';

        return value.toUpperCase() === 'HTTPS';
    }
}
