import { Link } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@hd-boutique/ui';
import { categoryLabels } from '@hd-boutique/types';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore();

  const categories = Object.entries(categoryLabels);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-x-hidden">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4 gap-2 lg:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <img src="/hd/branding/logo-light.svg" alt="H & D Boutique" className="h-8 lg:h-10 flex-shrink-0" />
            <span className="font-display text-lg lg:text-2xl font-bold text-brand-primary hidden sm:inline truncate">
              H & D Boutique
            </span>
          </Link>

          {/* Desktop Navigation - Always visible */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-6 flex-1 justify-center min-w-0 mt-1.5">
            {categories.map(([key, label]) => (
              <Link
                key={key}
                to={`/menu/${key.toLowerCase().replace(/_/g, '-')}`}
                className="text-brand-text hover:text-brand-primary transition-colors whitespace-nowrap text-xs lg:text-xs xl:text-sm 2xl:text-base flex-shrink-0"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0 mt-1.5">
            {/* Desktop User Actions - Hidden on smaller screens */}
            {isAuthenticated ? (
              <div className="hidden xl:flex items-center space-x-2 lg:space-x-3">
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" className="h-[38px]">
                      Admin
                    </Button>
                  </Link>
                )}
                <button
                  onClick={clearAuth}
                  className="flex items-center space-x-2.5 h-[38px] px-3 py-2 bg-brand-muted rounded-lg hover:bg-gray-200 transition-all group"
                >
                  <img
                    src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition-colors">
                    {user?.name?.split(' ')[0] || 'YD'}
                  </span>
                  <LogOut className="w-4 h-4 text-gray-500 group-hover:text-brand-primary transition-colors flex-shrink-0" />
                </button>
              </div>
            ) : (
              <Link to="/signin" className="hidden xl:block">
                <Button variant="primary" size="sm" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile/Tablet Menu Toggle - Shows on xl and below */}
            <button
              className="xl:hidden text-brand-text p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu - User Actions */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t max-w-full overflow-hidden">
            {/* Mobile Category Menu - Only show on small screens */}
            <nav className="md:hidden mb-4 pb-4 border-b">
              <div className="space-y-1">
                {categories.map(([key, label]) => (
                  <Link
                    key={key}
                    to={`/menu/${key.toLowerCase().replace(/_/g, '-')}`}
                    className="flex items-center py-2.5 px-3 text-brand-text hover:text-brand-primary hover:bg-brand-muted rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* User Actions in Mobile Menu */}
            {isAuthenticated ? (
              <div className="space-y-2">
                {/* Favorites */}
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="block">
                  <div className="flex items-center py-2.5 px-3 text-brand-text hover:text-brand-primary hover:bg-brand-muted rounded-lg transition-colors cursor-pointer">
                    <Heart className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium">Favorites</span>
                  </div>
                </Link>

                {/* Admin */}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                    <div className="flex items-center py-2.5 px-3 bg-brand-accent text-white hover:opacity-90 rounded-lg transition-all cursor-pointer">
                      <span className="text-sm font-medium">Admin Panel</span>
                    </div>
                  </Link>
                )}

                {/* User Profile with Sign Out */}
                <button
                  onClick={() => {
                    clearAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between py-3 px-3 bg-brand-muted hover:bg-gray-200 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img
                        src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-brand-text truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500">Tap to sign out</p>
                      </div>
                    </div>
                    <LogOut className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                  </div>
                </button>
              </div>
            ) : (
              <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="block">
                <div className="flex items-center justify-center py-2.5 px-3 bg-brand-accent text-white hover:opacity-90 rounded-lg transition-all cursor-pointer">
                  <User className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Sign In</span>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
