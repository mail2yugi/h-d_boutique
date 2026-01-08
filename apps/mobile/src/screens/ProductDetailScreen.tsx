import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.0.196:5001';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${productId}`, {
        timeout: 10000,
      });
      setProduct(response.data.data);
    } catch (error: any) {
      console.error('Error fetching product:', error.message);
      Alert.alert('Error', 'Could not load product details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi H&D Boutique, I'm interested in Product: ${product?.title} (ID: ${productId})`;
    const url = `https://wa.me/919916632308?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp');
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const discountedPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Image Gallery */}
      <View style={styles.imageContainer}>
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <>
            <Image
              source={{ uri: product.imageUrls[currentImageIndex] }}
              style={styles.mainImage}
              resizeMode="contain"
            />
            {/* Discount Badge */}
            {product.discountPercent > 0 && product.status !== 'sold' && (
              <View style={styles.topLeftBadge}>
                <Text style={styles.topLeftBadgeText}>{product.discountPercent}% OFF</Text>
              </View>
            )}
            {/* Sold Badge */}
            {product.status === 'sold' && (
              <View style={styles.topRightBadge}>
                <Text style={styles.topRightBadgeText}>SOLD</Text>
              </View>
            )}
            {/* Thumbnails */}
            {product.imageUrls.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnailContainer}
                contentContainerStyle={styles.thumbnailContent}
              >
                {product.imageUrls.map((url: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                    style={styles.thumbnailWrapper}
                  >
                    <Image
                      source={{ uri: url }}
                      style={[
                        styles.thumbnail,
                        currentImageIndex === index && styles.thumbnailActive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>
        
        {/* Category */}
        <Text style={styles.categoryText}>{product.category}</Text>

        {/* Price */}
        <View style={styles.priceSection}>
          {product.discountPercent > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{discountedPrice.toLocaleString()}</Text>
              <Text style={styles.originalPrice}>₹{product.price.toLocaleString()}</Text>
            </View>
          ) : (
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description}>{product.description}</Text>

        {/* WhatsApp Contact Button */}
        <TouchableOpacity
          style={[
            styles.whatsappButton,
            product.status === 'sold' && styles.whatsappButtonDisabled,
          ]}
          onPress={handleWhatsAppContact}
          disabled={product.status === 'sold'}
        >
          <Text style={styles.whatsappButtonText}>
            {product.status === 'sold' ? '❌ Sold Out' : '💬 Contact on WhatsApp'}
          </Text>
        </TouchableOpacity>

        {/* Product Details Section */}
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Product Details</Text>
          <Text style={styles.detailItem}>• Custom tailoring available</Text>
          <Text style={styles.detailItem}>• Premium quality fabrics</Text>
          <Text style={styles.detailItem}>• Expert craftsmanship</Text>
          <Text style={styles.detailItem}>• Free alterations within 7 days</Text>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.infoText}>
            Added on {new Date(product.createdAt).toLocaleDateString()}
          </Text>
          {product.status && (
            <View
              style={[
                styles.statusBadge,
                product.status === 'sold' && styles.statusBadgeSold,
                product.status === 'reserved' && styles.statusBadgeReserved,
              ]}
            >
              <Text style={styles.statusText}>{product.status.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  topLeftBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topLeftBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topRightBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#999',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topRightBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  thumbnailContent: {
    gap: 8,
  },
  thumbnailWrapper: {
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  thumbnailActive: {
    borderColor: '#D4AF37',
    borderWidth: 3,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 16,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButtonDisabled: {
    backgroundColor: '#999',
  },
  whatsappButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 13,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeSold: {
    backgroundColor: '#999',
  },
  statusBadgeReserved: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
