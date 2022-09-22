import express from 'express';
import controller from '../controllers/school.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/board-types', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getBoardTypes);
router.get('/board-type/:id', controller.getBoardTypeById);
router.get('/board-type-by-title/:title', controller.getBoardTypeByTitle);
router.put('/board-type/:id', middleware.verifyToken([Role.Administrator]), controller.updateBoardTypeById);
router.post('/board-type', middleware.verifyToken([Role.Administrator]), controller.addBoardType);
router.delete('/board-type/:id', middleware.verifyToken([Role.Administrator]), controller.deleteBoardTypeById);

export default { router };