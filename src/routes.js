import { Router } from 'express';
import multer from 'multer';
import MulterConfig from './config/multer';

import RecipientsController from './app/controllers/recipientsController';
import SessionController from './app/controllers/sessionController';
import FilesDeliverymanController from './app/controllers/fileDeliverymanController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrdersController from './app/controllers/ordersController';
import ProgressController from './app/controllers/progressController';
import OrdersListController from './app/controllers/ordersListController';
import OrdersDeliveredController from './app/controllers/ordersDeliveredController';
import DeliveryProblemsController from './app/controllers/deliveryProblemsController';
import EndProgressController from './app/controllers/endProgressController';
import ProblemsListController from './app/controllers/problemsListController';
import AuthMiddlwers from './app/middlewers/auth';

const routes = new Router();
const upload = multer(MulterConfig);

routes.post('/sessions', SessionController.store);
routes.post('/recipients', AuthMiddlwers, RecipientsController.store);
routes.put('/recipients', AuthMiddlwers, RecipientsController.update);
routes.delete('/recipients/:id', AuthMiddlwers, RecipientsController.delete);
routes.get('/recipients', AuthMiddlwers, RecipientsController.index);
routes.get('/recipients/:id', AuthMiddlwers, RecipientsController.show);

routes.post('/deliveryman', AuthMiddlwers, DeliverymanController.store);
routes.put('/deliveryman/:id', AuthMiddlwers, DeliverymanController.update);
routes.delete('/deliveryman/:id', AuthMiddlwers, DeliverymanController.delete);
routes.get('/deliveryman', AuthMiddlwers, DeliverymanController.index);

routes.post('/filesDeliveryman', upload.single('file'), AuthMiddlwers, FilesDeliverymanController.store);

routes.post('/orders', AuthMiddlwers, OrdersController.store);
routes.get('/orders', AuthMiddlwers, OrdersController.index);
routes.put('/orders/:id', AuthMiddlwers, OrdersController.update);
routes.delete('/orders/:id', AuthMiddlwers, OrdersController.delete);

routes.put('/progress/:id', AuthMiddlwers, ProgressController.update);

routes.put('/endprogress/:id', upload.single('file'), AuthMiddlwers, EndProgressController.update);

routes.get('/deliveryman/:id/deliveries', OrdersListController.index);

routes.get('/deliveryman/:id/delivered', OrdersDeliveredController.index);

routes.get('/deliveryproblems', AuthMiddlwers, DeliveryProblemsController.index);
routes.post('/deliveryproblems/:id/problems', AuthMiddlwers, DeliveryProblemsController.store);
routes.delete('/deliveryproblems/:id/cancel-delivery', AuthMiddlwers, DeliveryProblemsController.delete);

routes.get('/delivery/:id/problems', AuthMiddlwers, ProblemsListController.index);

export default routes;