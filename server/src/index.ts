import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

import indexRoutes from './routes/indexRoutes';
import usuariosRoutes from './routes/usuariosRoutes';

class Server {
    public app : Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }


    config():void{
        this.app.set('port',process.env.PORT || 3002);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }

    routes(): void {
        this.app.use(indexRoutes);
        this.app.use('/api/users', usuariosRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();