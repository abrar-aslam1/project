// Get the base URL for API calls based on environment
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use the deployed Netlify URL
    return '';  // Empty string means same domain
  }
  // In development, use the local Netlify dev server
  return 'http://localhost:9000';
};
