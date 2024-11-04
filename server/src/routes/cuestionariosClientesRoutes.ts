import { Router } from 'express';
import cuestionariosClientesController from '../controllers/cuestionariosClientesController';

class CuestionariosClientesRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', cuestionariosClientesController.list);
        this.router.get('/:id', cuestionariosClientesController.getOne);
        this.router.get('/cliente/:IdCliente', cuestionariosClientesController.getAllCuestionariosByCliente);
        this.router.post('/', cuestionariosClientesController.create);
        this.router.put('/:id', cuestionariosClientesController.update);
        this.router.delete('/:id', cuestionariosClientesController.delete);
    }
}

const cuestionariosClientesRoutes = new CuestionariosClientesRoutes();
export default cuestionariosClientesRoutes.router;