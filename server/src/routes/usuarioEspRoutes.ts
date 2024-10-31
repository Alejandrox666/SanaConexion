import { Router } from 'express';

import usuarioEspController from '../controllers/usuarioEspController';

class UsuarioEspRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', usuarioEspController.list);
        this.router.get('/:id', usuarioEspController.getOne);
        this.router.post('/especialistas', usuarioEspController.createEsp)
        this.router.put('/usuarios/:id', usuarioEspController.updateUsu)
        this.router.put('/especialistas/:id', usuarioEspController.updateEsp)
    }

}

const usuarioEspRoutes = new UsuarioEspRoutes();
export default usuarioEspRoutes.router;