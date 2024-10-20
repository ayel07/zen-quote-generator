import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Trash2, Filter } from 'lucide-react';

interface Quote {
  content: string;
  author: string;
}

const fallbackQuotes: Record<string, Quote[]> = {
  all: [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { content: "The best way to predict the future is to create it.", author: "Peter Drucker" }
  ],
  inspirational: [
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { content: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" }
  ],
  life: [
    { content: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { content: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
    { content: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
    { content: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.", author: "Ralph Waldo Emerson" },
    { content: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" }
  ],
  love: [
    { content: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo" },
    { content: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
    { content: "Where there is love there is life.", author: "Mahatma Gandhi" },
    { content: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
    { content: "Love is not about possession. Love is about appreciation.", author: "Osho" }
  ],
  wisdom: [
    { content: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { content: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },
    { content: "The fool doth think he is wise, but the wise man knows himself to be a fool.", author: "William Shakespeare" },
    { content: "By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.", author: "Confucius" },
    { content: "The invariable mark of wisdom is to see the miraculous in the common.", author: "Ralph Waldo Emerson" }
  ],
  happiness: [
    { content: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { content: "The secret of happiness is freedom, the secret of freedom is courage.", author: "Carrie Jones" },
    { content: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
    { content: "The greatest happiness you can have is knowing that you do not necessarily require happiness.", author: "William Saroyan" },
    { content: "Happiness is not a goal...it's a by-product of a life well-lived.", author: "Eleanor Roosevelt" }
  ],
  success: [
    { content: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer" },
    { content: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { content: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
    { content: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { content: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett" }
  ],
  technology: [
    { content: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
    { content: "It has become appallingly obvious that our technology has exceeded our humanity.", author: "Albert Einstein" },
    { content: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.", author: "Bill Gates" },
    { content: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    { content: "The real danger is not that computers will begin to think like men, but that men will begin to think like computers.", author: "Sydney J. Harris" }
  ]
};

const categories = [
  "all", "inspirational", "life", "love", "wisdom", "happiness", "success", "technology"
];

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  const fetchQuote = async (retries = 2) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = category === "all" 
        ? 'https://api.quotable.io/random'
        : `https://api.quotable.io/random?tags=${category}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote({ content: data.content, author: data.author });
    } catch (error) {
      console.error('Error fetching quote:', error);
      if (retries > 0) {
        setTimeout(() => fetchQuote(retries - 1), 1000);
      } else {
        setError('Unable to fetch a new quote. Using a random fallback quote for the selected category.');
        const fallbackCategory = fallbackQuotes[category] ? category : 'all';
        setQuote(fallbackQuotes[fallbackCategory][Math.floor(Math.random() * fallbackQuotes[fallbackCategory].length)]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [category]);

  const addToFavorites = () => {
    if (quote && !favorites.some(fav => fav.content === quote.content)) {
      setFavorites([...favorites, quote]);
    }
  };

  const removeFromFavorites = (quoteToRemove: Quote) => {
    setFavorites(favorites.filter(fav => fav.content !== quoteToRemove.content));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Zen Quote Generator</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="mb-4 flex items-center">
          <Filter className="mr-2" size={18} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Notice</p>
            <p>{error}</p>
          </div>
        )}
        {quote ? (
          <>
            <p className="text-xl font-semibold mb-4">"{quote.content}"</p>
            <p className="text-right text-gray-600">- {quote.author}</p>
          </>
        ) : (
          <p className="text-center text-gray-600">Loading quote...</p>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => fetchQuote()}
            disabled={isLoading}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 animate-spin" size={18} />
            ) : (
              <RefreshCw className="mr-2" size={18} />
            )}
            New Quote
          </button>
          <button
            onClick={addToFavorites}
            disabled={!quote || favorites.some(fav => fav.content === quote.content)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Heart className="mr-2" size={18} />
            Favorite
          </button>
        </div>
      </div>
      {favorites.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Favorite Quotes</h2>
          <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            {favorites.map((fav, index) => (
              <li key={`${fav.content}-${index}`} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">"{fav.content}"</p>
                  <p className="text-sm text-gray-600">- {fav.author}</p>
                </div>
                <button
                  onClick={() => removeFromFavorites(fav)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;