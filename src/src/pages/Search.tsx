import React, { useState } from 'react';
import { searchUsers } from '../lib/api';
import { UserProfile } from '../lib/types';
import { Search as SearchIcon, Mail, User } from 'lucide-react';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const data = await searchUsers(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Find Your <span className="text-blue-600">Skill Match</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Search for a skill you want to learn, and find SRM students who can teach it.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm"
            placeholder="Search skills (e.g., Python, Guitar, UI Design)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Searching students...</div>
        ) : (
          <>
            {searched && results.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No students found with that skill. Try a broader term.
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((user) => (
                <div key={user.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.year} Year Student</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Can Teach:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {skill.skill_name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      {user.badges.length > 0 && (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                           {user.badges[0].badge_name}
                         </span>
                      )}
                      <a href={`mailto:${user.email}`} className="flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
