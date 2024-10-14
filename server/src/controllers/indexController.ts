import { Request, Response } from 'express';

class IndexController{
    public index (req: Request, resp: Response){
        resp.json({text: 'API IS /api/games/'})
    }
}

export const indexController = new IndexController();
