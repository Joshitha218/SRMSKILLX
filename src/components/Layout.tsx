import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Users, User, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser, logoutUser } from '../lib/api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
  };

  React.useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });
    
    // Also listen for storage events in case local session changes in another tab
    window.addEventListener('storage', refreshUser);

    return () => {
        subscription.unsubscribe();
        window.removeEventListener('storage', refreshUser);
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        "bg-white/80 backdrop-blur-md border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                  S
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                  SRM SkillX
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" active={isActive('/')} icon={<Home size={18} />}>Home</NavLink>
              <NavLink to="/search" active={isActive('/search')} icon={<Search size={18} />}>Find Skills</NavLink>
              <NavLink to="/community" active={isActive('/community')} icon={<Users size={18} />}>Community</NavLink>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <NavLink to="/profile" active={isActive('/profile')} icon={<User size={18} />}>Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                  <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/search" onClick={() => setIsOpen(false)}>Find Skills</MobileNavLink>
              <MobileNavLink to="/community" onClick={() => setIsOpen(false)}>Community</MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>Profile</MobileNavLink>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>Login</MobileNavLink>
                  <MobileNavLink to="/register" onClick={() => setIsOpen(false)}>Register</MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">SRM SkillX</span>
              <p className="text-gray-400 text-sm mt-1">Peer learning platform for SRM AP Students.</p>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; 2024 SRM SkillX. Made for Hackathons.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children, active, icon }: { to: string; children: React.ReactNode; active: boolean; icon?: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}
