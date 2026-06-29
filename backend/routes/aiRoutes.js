const express = require('express');
const router = express.Router();
const {
  generateConceptExplanation,
  regenerateQuestionsForSession,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/explain-concept', generateConceptExplanation);
router.post('/generate-questions', regenerateQuestionsForSession);

module.exports = router;
