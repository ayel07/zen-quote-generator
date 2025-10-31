// API endpoints to try in order of preference
const API_ENDPOINTS = [
  'https://api.quotable.io/random',
  'https://zenquotes.io/api/random',
  'https://api.adviceslip.com/advice',
];

export interface Quote {
  content: string;
  author: string;
  category?: string;
}

/**
 * Fetches a random quote from available APIs with fallback support
 */
export const fetchRandomQuote = async (): Promise<Quote | null> => {
  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`Attempting to fetch from: ${endpoint}`);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        console.warn(`Failed to fetch from ${endpoint}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Success from ${endpoint}:`, data);
      
      // Parse based on API format
      if (endpoint.includes('quotable.io')) {
        return {
          content: data.content,
          author: data.author,
        };
      } else if (endpoint.includes('zenquotes.io')) {
        const quoteData = Array.isArray(data) ? data[0] : data;
        return {
          content: quoteData.q,
          author: quoteData.a.replace(/,\s*$/, ''),
        };
      } else if (endpoint.includes('adviceslip.com')) {
        return {
          content: data.slip.advice,
          author: 'Advice Slip',
        };
      }
    } catch (error) {
      console.warn(`Error fetching from ${endpoint}:`, error);
      continue;
    }
  }
  
  return null;
};
