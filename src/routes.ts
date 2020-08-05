import express, { request, response } from 'express';
import db from './database/connections';
import convertTime from './utils/convert';
import ClassesController from './controllers/classesController';
import ConnectinsController from './controllers/connectionsControllers';

const routes = express.Router();

const classesController = new ClassesController();
const connectionsContrller = new ConnectinsController();

routes.post('/classes',classesController.create);
routes.get('/classes',classesController.index);
routes.post('/connections', connectionsContrller.create);
routes.get('/connections', connectionsContrller.index);


export default routes;