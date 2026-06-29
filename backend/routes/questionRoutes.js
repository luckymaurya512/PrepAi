const express = require('express');
const router = express.Router();
const { addQuestion, togglePinQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/add', addQuestion);
router.put('/:id/pin', togglePinQuestion);

module.exports = router;
