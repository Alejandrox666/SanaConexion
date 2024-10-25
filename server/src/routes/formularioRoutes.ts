import { Router } from "express";
import formularioController from "../controllers/formularioController";

class FormularioRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/',formularioController.formList);
        this.router.get('/:id',formularioController.getOneForm);
    }
}

const formularioRoutes = new FormularioRoutes();
export default formularioRoutes.router;