import { Router } from 'express';
import respuestasController from '../controllers/respuestasController';

class RespuestassRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',respuestasController.list);
        this.router.get('/:id',respuestasController.getOne);
        this.router.get('/rbIU/:IdUsuario', respuestasController.getOneCliente);
        this.router.get('/rbIC/:IdCuestionario',respuestasController.getAllPreguntasByIdCuestionario);
        this.router.post('/',respuestasController.create);
        this.router.put('/:id',respuestasController.update);
        this.router.delete('/:id',respuestasController.delete);
    }

}

const respuestassRoutes = new RespuestassRoutes();
export default respuestassRoutes.router;