export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
  },
  SESSIONS: {
    BASE: '/api/sessions',
    BY_ID: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
    GENERATE_MORE: (id) => `/api/sessions/${id}/generate-more`,
  },
  QUESTIONS: {
    ADD: '/api/questions/add',
    TOGGLE_PIN: (id) => `/api/questions/${id}/pin`,
  },
  AI: {
    EXPLAIN_CONCEPT: '/api/ai/explain-concept',
    GENERATE_QUESTIONS: '/api/ai/generate-questions',
  },
};
