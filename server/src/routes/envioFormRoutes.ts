import { Router } from "express";
import envioFormController from "../controllers/envioFormController";

class EnvioFormRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', envioFormController.list);
        this.router.get('/:id', envioFormController.getOne);
        this.router.post('/', envioFormController.create);
        this.router.put('/:id', envioFormController.update);
        this.router.delete('/:id', envioFormController.delete)
    }
}

const envioFormRoutes = new EnvioFormRoutes();
export default envioFormRoutes.router;