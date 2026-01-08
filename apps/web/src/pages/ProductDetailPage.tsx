import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Badge } from '@hd-boutique/ui';
import { ProductWithImages, categoryLabels, ProductCategory } from '@hd-boutique/types';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchProduct();
      if (isAuthenticated) {
        checkFavorited();
      }
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorited = async () => {
    try {
      const response = await api.get(`/api/favorites/${id}/check`);
      setFavorited(response.data.data.favorited);
    } catch (error) {
      // Ignore error
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to favorite products');
      return;
    }

    try {
      const response = await api.post(`/api/favorites/${id}/toggle`);
      setFavorited(response.data.data.favorited);
      toast.success(response.data.data.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to toggle favorite');
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi H&D Boutique, I'm interested in Product: ${product?.title} (ID: ${id})`;
    const url = `https://wa.me/919916632308?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discountPercent) / 100;

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <img
              src={product.imageUrls[currentImageIndex]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.status === 'sold' && (
              <div className="absolute top-4 right-4">
                <Badge variant="sold">SOLD</Badge>
              </div>
            )}
            {product.discountPercent > 0 && product.status !== 'sold' && (
              <div className="absolute top-4 left-4">
                <Badge variant="discount">{product.discountPercent}% OFF</Badge>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${
                    currentImageIndex === index ? 'ring-2 ring-brand-primary' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-display text-4xl font-bold mb-4">{product.title}</h1>
          
          <p className="text-lg text-gray-600 mb-4">
            {categoryLabels[product.category as ProductCategory]}
          </p>

          <div className="mb-6">
            {product.discountPercent > 0 ? (
              <div>
                <span className="text-3xl font-bold text-brand-primary">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                <span className="ml-3 text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-brand-primary">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex gap-4 mb-6">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleWhatsAppContact}
              disabled={product.status === 'sold'}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {product.status === 'sold' ? 'Sold Out' : 'Contact on WhatsApp'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={toggleFavorite}
              disabled={!isAuthenticated}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mb-4">
              Sign in to save favorites
            </p>
          )}

          <div className="border-t pt-6">
            <h3 className="font-display text-xl font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Custom tailoring available</li>
              <li>• Premium quality fabrics</li>
              <li>• Expert craftsmanship</li>
              <li>• Free alterations within 7 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
