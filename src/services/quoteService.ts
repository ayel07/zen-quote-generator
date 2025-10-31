// Fallback quotes organized by category
const fallbackQuotes: Record<string, Array<{ q: string; a: string }>> = {
  all: [
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
    { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
    { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" }
  ],
  inspirational: [
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
    { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
    { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
    { q: "The only limit to our realization of tomorrow will be our doubts of today.", a: "Franklin D. Roosevelt" }
  ],
  life: [
    { q: "Life is really simple, but we insist on making it complicated.", a: "Confucius" },
    { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
    { q: "Life is 10% what happens to you and 90% how you react to it.", a: "Charles R. Swindoll" },
    { q: "Change your thoughts and you change your world.", a: "Norman Vincent Peale" },
    { q: "The purpose of our lives is to be happy.", a: "Dalai Lama" }
  ],
  love: [
    { q: "The best thing to hold onto in life is each other.", a: "Audrey Hepburn" },
    { q: "Love is composed of a single soul inhabiting two bodies.", a: "Aristotle" },
    { q: "Where there is love there is life.", a: "Mahatma Gandhi" },
    { q: "The greatest happiness of life is the conviction that we are loved.", a: "Victor Hugo" },
    { q: "To love and be loved is to feel the sun from both sides.", a: "David Viscott" }
  ],
  wisdom: [
    { q: "The only true wisdom is in knowing you know nothing.", a: "Socrates" },
    { q: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", a: "Albert Einstein" },
    { q: "The fool doth think he is wise, but the wise man knows himself to be a fool.", a: "William Shakespeare" },
    { q: "By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.", a: "Confucius" },
    { q: "The invariable mark of wisdom is to see the miraculous in the common.", a: "Ralph Waldo Emerson" }
  ],
  happiness: [
    { q: "Happiness is not something ready-made. It comes from your own actions.", a: "Dalai Lama" },
    { q: "The greatest happiness you can have is knowing that you do not necessarily require happiness.", a: "William Saroyan" },
    { q: "Happiness is when what you think, what you say, and what you do are in harmony.", a: "Mahatma Gandhi" },
    { q: "The secret of happiness is freedom, the secret of freedom is courage.", a: "Carrie Jones" },
    { q: "Happiness is not a goal; it is a by-product.", a: "Eleanor Roosevelt" }
  ],
  success: [
    { q: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", a: "Albert Schweitzer" },
    { q: "Success is walking from failure to failure with no loss of enthusiasm.", a: "Winston Churchill" },
    { q: "The road to success and the road to failure are almost exactly the same.", a: "Colin R. Davis" },
    { q: "Success usually comes to those who are too busy to be looking for it.", a: "Henry David Thoreau" },
    { q: "The secret of success is to do the common thing uncommonly well.", a: "John D. Rockefeller Jr." }
  ],
  technology: [
    { q: "Technology is best when it brings people together.", a: "Matt Mullenweg" },
    { q: "It has become appallingly obvious that our technology has exceeded our humanity.", a: "Albert Einstein" },
    { q: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.", a: "Bill Gates" },
    { q: "Any sufficiently advanced technology is indistinguishable from magic.", a: "Arthur C. Clarke" },
    { q: "The real problem is not whether machines think but whether men do.", a: "B. F. Skinner" }
  ]
};

// External API endpoints as fallback
const API_ENDPOINTS = [
  'https://api.quotable.io/random',
  'https://zenquotes.io/api/random',
];

export interface Quote {
  content: string;
  author: string;
  category?: string;
}

/**
 * Fetches a random quote, prioritizing local quotes with category support
 * @param category - Category to filter quotes (e.g., 'technology', 'wisdom', 'all')
 */
export const fetchRandomQuote = async (category: string = 'all'): Promise<Quote | null> => {
  // First, try to get from local fallback quotes (guaranteed to work and support categories)
  const categoryKey = fallbackQuotes[category] ? category : 'all';
  const categoryQuotes = fallbackQuotes[categoryKey];
  
  // For now, prioritize local quotes since APIs are unreliable
  if (categoryQuotes && categoryQuotes.length > 0) {
    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    console.log(`Fetched from local quotes (${categoryKey}):`, randomQuote);
    return {
      content: randomQuote.q,
      author: randomQuote.a,
    };
  }
  
  // Fallback: Try external APIs if local quotes somehow fail
  for (const endpoint of API_ENDPOINTS) {
    try {
      let url = endpoint;
      if (endpoint.includes('quotable.io') && category && category !== 'all') {
        url = `${endpoint}?tags=${category}`;
      }
      
      console.log(`Attempting external API: ${url}`);
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      
      if (!response.ok) {
        console.warn(`Failed from ${endpoint}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Success from ${endpoint}:`, data);
      
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
      }
    } catch (error) {
      console.warn(`Error from ${endpoint}:`, error);
      continue;
    }
  }
  
  return null;
};
