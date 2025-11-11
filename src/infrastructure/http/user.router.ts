import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../shared/infrastructure/http/auth.middleware'; 

export const createUserRouter = (userController: UserController): Router => {
  const router = Router();

  router.post('/', authMiddleware, userController.create);
  router.put('/:id', authMiddleware, userController.update);
  router.delete('/:id', authMiddleware, userController.delete);

  router.get('/', userController.getAll); 
  router.get('/:id', userController.getById);
  router.post('/login', userController.login);

  return router;
};