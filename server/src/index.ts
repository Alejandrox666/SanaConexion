import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

import indexRoutes from './routes/indexRoutes';
import loginRoutes from './routes/loginRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import usuarioEspRoutes from './routes/usuarioEspRoutes';
import clientesRoutes from './routes/clientesRoutes';
import formularioRoutes from './routes/formularioRoutes';
import chatsRoutes from './routes/chatsRoutes'
import respuestasRoutes from './routes/respuestasRoutes';
import cuestionariosClientesRoutes from './routes/cuestionariosClientesRoutes';
import envioFormRoutes from './routes/envioFormRoutes';





class Server {
    public app : Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }


    config():void{
        this.app.set('port',process.env.PORT || 10000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    }

    routes(): void {
        this.app.use(indexRoutes);
        this.app.use('/api/users', usuariosRoutes);
        this.app.use('/api/clientes', clientesRoutes);
        this.app.use('/api/login', loginRoutes)
        this.app.use('/api/usuarioEsp',usuarioEspRoutes)
        this.app.use('/api/formularios',formularioRoutes)
        this.app.use('/api/chats',chatsRoutes)
        this.app.use('/api/respuestas', respuestasRoutes);
        this.app.use('/api/cuestionariosClientes', cuestionariosClientesRoutes);
        this.app.use('/api/envioForm', envioFormRoutes);
       
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();