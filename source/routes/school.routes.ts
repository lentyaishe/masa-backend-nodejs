import express from 'express';
import controller from '../controllers/school.controller';
const router = express.Router();

router.get('/board-types', controller.getBoardTypes);
router.get('/board-type/:id', controller.getBoardTypeById);
router.get('/board-type-by-title/:title', controller.getBoardTypeByTitle);
router.put('/board-type/:id', controller.updateBoardTypeById);
router.post('/board-type', controller.addBoardType);
router.delete('/board-type/:id', controller.deleteBoardTypeById);

export default { router };