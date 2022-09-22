import express from 'express';
import controller from '../controllers/school.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/board-types', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getBoardTypes);
router.get('/board-type/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getBoardTypeById);
router.get('/board-type-by-title/:title', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getBoardTypeByTitle);
router.put('/board-type/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.updateBoardTypeById);
router.post('/board-type', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.addBoardType);
router.delete('/board-type/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.deleteBoardTypeById);

export default { router };