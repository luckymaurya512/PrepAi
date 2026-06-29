/**
 * Get initials from a full name (e.g., "John Doe" → "JD")
 */
export const getInitials = (name = '') => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Truncate long text with an ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Map experience level to a color class/style
 */
export const getExperienceColor = (experience) => {
  const map = {
    'Entry Level': '#10b981',
    Junior: '#06b6d4',
    'Mid Level': '#6366f1',
    Senior: '#8b5cf6',
    Lead: '#f59e0b',
    Principal: '#ef4444',
  };
  return map[experience] || '#6366f1';
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
