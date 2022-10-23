import express from 'express';
import controller from '../controllers/demo.controller';
const router = express.Router();

router.get('/hello-world', controller.getHelloWorld);
router.get('/timeout', controller.getWithTimeout);
router.get('/delay/:seconds', controller.getWithDelay);
router.get('/delay-async/:seconds', controller.getWithDelayAsync);
router.get('/delay-validated/:seconds', controller.getWithDelayValidated);
router.get('/double-wait', controller.getWithDoubleTimeout);
router.get('/double-wait-chained', controller.getWithDoubleTimeoutChained);
router.get('/double-wait-parallel', controller.getWithDoubleTimeoutParallel);

export default { router };