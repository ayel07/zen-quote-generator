import { useState, useEffect } from 'react';
import { RefreshCw, Heart, Trash2, Filter, Tag } from 'lucide-react';
import { fetchRandomQuote } from './services/quoteService';

interface Quote {
  content: string;
  author: string;
  category?: string;
}

const categories = [
  "all", "inspirational", "life", "love", "wisdom", "happiness", "success", "technology"
];

const MAX_FAVORITES = 10;

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch quote from service (uses local quotes with category support + API fallback)
      const apiQuote = await fetchRandomQuote(category);
      
      if (apiQuote) {
        setQuote({ ...apiQuote, category: category });
      } else {
        // This should rarely happen as service provides local fallback
        setError('Unable to fetch a quote. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An error occurred while fetching the quote.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [category]);

  const addToFavorites = () => {
    if (quote && !favorites.some(fav => fav.content === quote.content) && favorites.length < MAX_FAVORITES) {
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
          {favorites.length < MAX_FAVORITES && (
            <button
              onClick={addToFavorites}
              disabled={!quote || favorites.some(fav => fav.content === quote.content)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Heart className="mr-2" size={18} />
              Favorite
            </button>
          )}
          {favorites.length >= MAX_FAVORITES && (
            <div className="bg-red-100 border border-red-400 text-red-700 font-bold py-2 px-4 rounded flex items-center">
              <Heart className="mr-2 fill-red-700" size={18} />
              <span className="text-sm">Max 10 Favorites</span>
            </div>
          )}
        </div>
      </div>
      {favorites.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Favorite Quotes</h2>
          <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            {favorites.map((fav, index) => (
              <li key={`${fav.content}-${index}`} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Tag size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-500">
                      {fav.category ? fav.category.charAt(0).toUpperCase() + fav.category.slice(1) : 'Uncategorized'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(fav)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="font-semibold mb-1">"{fav.content}"</p>
                <p className="text-sm text-gray-600">- {fav.author}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;