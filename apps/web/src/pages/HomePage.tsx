import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, Badge, Input, Select } from '@hd-boutique/ui';
import { ProductWithImages, categoryLabels, ProductCategory } from '@hd-boutique/types';
import api from '@/lib/axios';

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    status: 'available',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products', { params: filters });
      setProducts(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-primary mb-4">
          H & D Boutique
        </h1>
        <p className="text-xl text-brand-text max-w-2xl mx-auto">
          Where Traditional Elegance Meets Contemporary Style
        </p>
        <p className="mt-4 text-lg text-gray-600">
          Exquisite custom-tailored blouses, designer sarees, lehengas, and bridal wear
        </p>
      </section>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            options={[
              { value: '', label: 'All Categories' },
              ...Object.entries(categoryLabels).map(([key, label]) => ({
                value: key,
                label,
              })),
            ]}
          />
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'available', label: 'Available' },
              { value: 'sold', label: 'Sold' },
            ]}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <Card hoverable className="h-full">
                <div className="relative">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  {product.status === 'sold' && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="sold">SOLD</Badge>
                    </div>
                  )}
                  {product.discountPercent > 0 && product.status !== 'sold' && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="discount">{product.discountPercent}% OFF</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {categoryLabels[product.category as ProductCategory]}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discountPercent > 0 ? (
                        <>
                          <span className="text-lg font-bold text-brand-primary">
                            ₹{calculateDiscountedPrice(product.price, product.discountPercent).toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-brand-primary">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
