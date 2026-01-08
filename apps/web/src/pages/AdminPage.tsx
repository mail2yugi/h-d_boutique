import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button, Input } from '@hd-boutique/ui';
import { Plus, Tag, Package, Trash } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Product, ProductCategory, categoryLabels } from '@hd-boutique/types';

type TabType = 'products' | 'create';

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Form state for creating products
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'BLOUSE' as ProductCategory,
    discountPercent: '0',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, selectedCategory, selectedStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await api.get(`/api/admin/products?${params}`);
      setProducts(response.data.data || []);
    } catch (error: any) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('discountPercent', formData.discountPercent);
      
      for (let i = 0; i < selectedFiles.length; i++) {
        formDataToSend.append('images', selectedFiles[i]);
      }

      await api.post('/api/admin/products', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'BLOUSE',
        discountPercent: '0',
      });
      setSelectedFiles(null);
      setActiveTab('products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (productId: string, newStatus: 'available' | 'sold') => {
    try {
      await api.patch(`/api/admin/products/${productId}/status`, { status: newStatus });
      toast.success(`Product marked as ${newStatus}`);
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateDiscount = async (productId: string) => {
    const discount = prompt('Enter discount percentage (0-100):');
    if (discount === null) return;
    
    const discountNum = parseFloat(discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      toast.error('Invalid discount value');
      return;
    }

    try {
      await api.patch(`/api/admin/products/${productId}/discount`, { discountPercent: discountNum });
      toast.success('Discount updated successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to update discount');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/api/admin/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete product');
    }
  };

  const getImageUrl = (product: any) => {
    // Use imageUrls if available, otherwise construct from imageIds
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/images/${product.imageIds[0]}`;
  };

  if (!isAdmin) return null;

  return (
    <div className="container-custom py-8">
      <h1 className="font-display text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-brand-primary text-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'create'
              ? 'border-b-2 border-brand-primary text-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create Product
        </button>
      </div>

      {/* Products List Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found. Create your first product!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {product.status === 'sold' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        SOLD
                      </div>
                    )}
                    {product.discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {product.discountPercent}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-brand-primary font-bold mb-3">
                      ₹{product.price}
                      {product.discountPercent > 0 && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{Math.round(product.price / (1 - product.discountPercent / 100))}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.status === 'available' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(product._id, 'sold')}
                        >
                          Mark as Sold
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateStatus(product._id, 'available')}
                        >
                          Mark Available
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateDiscount(product._id)}
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        Discount
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Product Tab */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="font-display text-2xl font-bold mb-6">Create New Product</h2>
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Red Embroidered Silk Blouse"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="5000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <Input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images * (Max 5 images, 10MB each)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
              {selectedFiles && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFiles.length} image(s) selected
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
