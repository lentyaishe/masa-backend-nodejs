import express from 'express';
import controller from '../controllers/school.controller';
const router = express.Router();

router.get('/general/board-types', controller.getBoardTypes);
router.get('/general/board-type/:id', controller.getBoardTypeById);
router.get('/general/board-type-by-title/:title', controller.getBoardTypeByTitle);
router.put('/general/board-type/:id', controller.updateBoardTypeById);

export default { router };