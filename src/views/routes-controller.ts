import * as fs from 'fs';

export default class RoutesController {
    constructor() {}

    home(req: any, res: any) {
        res.status(200).render(fs.readFileSync('./base.pug'));
    }
}
