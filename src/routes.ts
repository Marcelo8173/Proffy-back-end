import express, { request, response } from 'express';
import db from './database/connections';
import convertTime from './utils/convert';
import ClassesController from './controllers/classesController';

const routes = express.Router();

const classesController = new ClassesController();

routes.post('/classes',classesController.create);
routes.get('/classes',classesController.index);


export default routes;