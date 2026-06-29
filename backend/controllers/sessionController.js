const Session = require('../models/Session');
const Question = require('../models/Question');
const { generateQuestionsAndAnswers } = require('./aiController');

// @desc    Create a new interview session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ message: 'Role and experience are required' });
    }

    // Create the session first
    const session = await Session.create({
      userId: req.user._id,
      role,
      experience,
      topicsToFocus: topicsToFocus || '',
      description: description || '',
    });

    // Generate AI questions for the session
    try {
      const result = await generateQuestionsAndAnswers(role, experience, topicsToFocus);
      const generatedQA = result?.questions || [];
      const isAIGenerated = result?.isAIGenerated || false;

      if (generatedQA && generatedQA.length > 0) {
        const questionDocs = await Question.insertMany(
          generatedQA.map((qa) => ({
            sessionId: session._id,
            question: qa.question,
            answer: qa.answer,
            isPinned: false,
          }))
        );

        // Link questions and set AI status
        session.questions = questionDocs.map((q) => q._id);
        session.isAIGenerated = isAIGenerated;
        await session.save();
      }
    } catch (aiError) {
      console.error('AI generation error (session still created):', aiError.message);
      // Session created without questions — user can regenerate
    }

    const populatedSession = await Session.findById(session._id).populate('questions');

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error('Create session error:', error.message);
    res.status(500).json({ message: 'Server error creating session' });
  }
};

// @desc    Get all sessions for logged-in user
// @route   GET /api/sessions
// @access  Private
const getAllSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalSessions = await Session.countDocuments({ userId: req.user._id });

    const sessions = await Session.find({ userId: req.user._id })
      .populate('questions', 'isPinned')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      sessions,
      currentPage: page,
      totalPages: Math.ceil(totalSessions / limit),
      totalSessions,
      hasMore: page < Math.ceil(totalSessions / limit),
    });
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
};

// @desc    Get a specific session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate({
      path: 'questions',
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session by ID error:', error.message);
    res.status(500).json({ message: 'Server error fetching session' });
  }
};

// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Delete all associated questions
    await Question.deleteMany({ sessionId: session._id });

    // Delete the session
    await Session.findByIdAndDelete(session._id);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error.message);
    res.status(500).json({ message: 'Server error deleting session' });
  }
};

module.exports = { createSession, getAllSessions, getSessionById, deleteSession };
