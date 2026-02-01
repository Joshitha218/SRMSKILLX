import React, { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, MessageCircle } from 'lucide-react';
import { searchUsers } from '../lib/api';
import { UserProfile } from '../lib/types';
import { Link } from 'react-router-dom';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchUsers(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Find Skills & Peers
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Search for students by skill (e.g., "Python", "Design") or name.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            className="block w-full rounded-full border-gray-300 pl-6 pr-14 py-4 shadow-lg focus:border-blue-500 focus:ring-blue-500 text-lg"
            placeholder="What do you want to learn today?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 transition-colors"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Searching specifically for "{query}"...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.year} Year</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Link 
                        to={`/chat/${user.id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Link>
                     {/* Placeholder for View Profile if needed */}
                     <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            hasSearched && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No users found matching "{query}". Try a different skill or name.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
