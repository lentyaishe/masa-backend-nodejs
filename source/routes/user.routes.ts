import express from 'express';
import controller from '../controllers/user.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/:id', middleware.verifyToken([Role.Administrator]), controller.getById);
router.post('/', middleware.verifyToken([Role.Administrator]), controller.add);
router.put('/:id', middleware.verifyToken([Role.Administrator]), controller.updateById);
router.delete('/:id', middleware.verifyToken([Role.Administrator]), controller.deleteById);

export default { router };