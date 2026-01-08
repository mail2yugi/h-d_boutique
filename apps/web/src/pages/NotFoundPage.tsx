import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@hd-boutique/ui';

export default function NotFoundPage() {
  return (
    <div className="container-custom py-16 text-center">
      <h1 className="font-display text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page not found</p>
      <Link to="/">
        <Button variant="primary">
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
