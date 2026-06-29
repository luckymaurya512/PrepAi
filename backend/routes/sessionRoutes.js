const express = require('express');
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getSessionById,
  deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All session routes are protected

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);

module.exports = router;
