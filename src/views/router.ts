import { Router } from 'express';
import RoutesController from '@src/views/routes-controller';

const routerView = Router();

const routesController = new RoutesController();

routerView.get('/', routesController.home);

export default routerView;
