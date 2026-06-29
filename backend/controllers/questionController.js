const Question = require('../models/Question');
const Session = require('../models/Session');

// @desc    Add a question to a session
// @route   POST /api/questions/add
// @access  Private
const addQuestion = async (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({ message: 'sessionId, question, and answer are required' });
    }

    // Verify session belongs to user
    const session = await Session.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const newQuestion = await Question.create({ sessionId, question, answer });

    // Link question to session
    session.questions.push(newQuestion._id);
    await session.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Add question error:', error.message);
    res.status(500).json({ message: 'Server error adding question' });
  }
};

// @desc    Toggle pin status of a question
// @route   PUT /api/questions/:id/pin
// @access  Private
const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Verify the session belongs to user
    const session = await Session.findOne({
      _id: question.sessionId,
      userId: req.user._id,
    });
    if (!session) {
      return res.status(403).json({ message: 'Not authorized to modify this question' });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.json({ message: `Question ${question.isPinned ? 'pinned' : 'unpinned'} successfully`, question });
  } catch (error) {
    console.error('Toggle pin error:', error.message);
    res.status(500).json({ message: 'Server error toggling pin' });
  }
};

module.exports = { addQuestion, togglePinQuestion };
