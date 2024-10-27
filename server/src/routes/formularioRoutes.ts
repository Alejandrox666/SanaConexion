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
        this.router.post('/',formularioController.createForm)
        this.router.post('/preguntas',formularioController.createPre)
        this.router.put('/:id',formularioController.updateForm)
        this.router.put('/preguntas/:id',formularioController.updatePre)
        this.router.delete('/:id',formularioController.deleteForm)
        this.router.delete('/preguntas/:id',formularioController.deletePre)
    }
}

const formularioRoutes = new FormularioRoutes();
export default formularioRoutes.router;