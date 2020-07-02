import { Router } from 'express';

import RecipientsController from './app/controllers/recipientsController';
import SessionController from './app/controllers/sessionController';
import AuthMiddlwers from './app/middlewers/auth';

const routes = new Router();

routes.post('/recipients', AuthMiddlwers, RecipientsController.store);
routes.post('/sessions', SessionController.store);
routes.put('/recipients', AuthMiddlwers, RecipientsController.update);
routes.delete('/recipients/:id', RecipientsController.delete);
routes.get('/recipients', RecipientsController.index);
routes.get('/recipients/:id', RecipientsController.show);

export default routes;