import { Router } from "express";
import chatsController from "../controllers/chatsController";

class ChatsRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/',chatsController.chatList);
        this.router.get('/participantes',chatsController.partList);
        this.router.get('/msj',chatsController.msjList);
        this.router.get('/msj/:id',chatsController.getOneMsj);
        this.router.post('/',chatsController.createChat)
        this.router.post('/participantes',chatsController.createPart)
        this.router.post('/msj',chatsController.createMsj)
    }
}

const chatsRoutes = new ChatsRoutes();
export default chatsRoutes.router;