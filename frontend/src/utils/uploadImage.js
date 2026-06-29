/**
 * Converts a File object to a base64 data URL string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validate that a file is an image and within size limit
 */
export const validateImageFile = (file, maxSizeMB = 2) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file (JPEG, PNG, GIF, WebP).' };
  }
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB.` };
  }
  return { valid: true, error: null };
};
