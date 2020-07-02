import { Router } from 'express';

import RecipientsController from './app/controllers/recipientsController';
import SessionController from './app/controllers/sessionController';
import AuthMiddlwers from './app/middlewers/auth';

const routes = new Router();

routes.post('/recipients', AuthMiddlwers, RecipientsController.store);
routes.post('/sessions', SessionController.store);
routes.put('/recipients', AuthMiddlwers, RecipientsController.update);
routes.delete('/recipients/:id', AuthMiddlwers, RecipientsController.delete);
routes.get('/recipients', AuthMiddlwers, RecipientsController.index);
routes.get('/recipients/:id', AuthMiddlwers, RecipientsController.show);

export default routes;