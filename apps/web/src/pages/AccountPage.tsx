import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export default function AccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="container-custom py-8">
      <h1 className="font-display text-4xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-semibold mb-4">Favorites</h2>
          <p className="text-gray-600">View your favorite products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-semibold mb-4">Orders</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
