import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Trash2 } from 'lucide-react';

interface Quote {
  content: string;
  author: string;
}

const fallbackQuote: Quote = {
  content: "The only way to do great work is to love what you do.",
  author: "Steve Jobs"
};

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async (retries = 2) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.quotable.io/random');
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
        setError('Unable to fetch a new quote. Please try again later.');
        setQuote(fallbackQuote);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
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
              <li key={index} className="p-4 flex justify-between items-center">
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
