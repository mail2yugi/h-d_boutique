import { Link } from 'react-router-dom';
import { Menu, X, Heart, User, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@hd-boutique/ui';
import { categoryLabels } from '@hd-boutique/types';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore();

  const categories = Object.entries(categoryLabels);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/hd/branding/logo-light.svg" alt="H & D Boutique" className="h-10" />
            <span className="font-display text-2xl font-bold text-brand-primary hidden sm:inline">
              H & D Boutique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {categories.map(([key, label]) => (
              <Link
                key={key}
                to={`/menu/${key.toLowerCase().replace(/_/g, '-')}`}
                className="text-brand-text hover:text-brand-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <Button variant="ghost" size="sm" onClick={clearAuth}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/signin">
                <Button variant="primary" size="sm" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-brand-text"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            {categories.map(([key, label]) => (
              <Link
                key={key}
                to={`/menu/${key.toLowerCase().replace(/_/g, '-')}`}
                className="block py-2 text-brand-text hover:text-brand-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
