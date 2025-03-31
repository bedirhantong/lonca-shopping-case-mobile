import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ProductUseCase } from '../../domain/usecases/product.usecase';
import { Product } from '../../domain/models/product.model';
import { Review } from '../../../../features/reviews/domain/models/review.model';
import { ReviewUseCase } from '../../../../features/reviews/domain/usecases/review.usecase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { toggleFavorite } from '../../../../store/features/favoriteSlice';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.45;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = new Animated.Value(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const dispatch = useAppDispatch();
  const { items: favorites, pendingToggles } = useAppSelector((state) => state.favorites);
  const isFavorite = favorites.some(fav => fav.product.id === id);
  const isTogglePending = pendingToggles[id as string];

  const productUseCase = new ProductUseCase();
  const reviewUseCase = new ReviewUseCase();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerBackground = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 100],
    outputRange: ['rgba(0,0,0,0)', '#fff'],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const loadProduct = async () => {
    try {
      const response = await productUseCase.getProductById(id as string);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewUseCase.getProductReviews(id as string);
      setReviews(response.data.items);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (product && !isTogglePending) {
      try {
        await dispatch(toggleFavorite(product)).unwrap();
      } catch (error: any) {
        Alert.alert(
          'Error',
          typeof error === 'string' ? error : 'Failed to update favorite status'
        );
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewUseCase.createReview(id as string, {
        rating,
        comment: comment.trim(),
      });
      setShowReviewModal(false);
      setComment('');
      setRating(5);
      loadReviews();
      Alert.alert('Success', 'Review submitted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadProduct(), loadReviews()]);
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <FontAwesome
          key={index}
          name={index < count ? 'star' : 'star-o'}
          size={16}
          color={index < count ? '#FFD700' : '#666'}
          style={{ marginRight: 4 }}
        />
      ));
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        setScrollPosition(event.nativeEvent.contentOffset.y);
      }
    }
  );

  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  }

  const allImages = [product.main_image, ...product.images];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={scrollPosition > IMAGE_HEIGHT - 100 ? "dark-content" : "light-content"}
      />

      {/* Header Background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          { 
            backgroundColor: headerBackground,
            borderBottomColor: scrollPosition > IMAGE_HEIGHT - 100 ? '#f0f0f0' : 'transparent',
            borderBottomWidth: 1,
          }
        ]} 
      />

      {/* Header Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={[styles.headerGradient]}
        pointerEvents="none"
      />

      {/* Animated Header Title */}
      <Animated.View 
        style={[
          styles.animatedHeader, 
          { opacity: headerTitleOpacity }
        ]}
      >
        <Text numberOfLines={1} style={styles.headerTitle}>
          {product?.name}
        </Text>
      </Animated.View>

      {/* Back and Favorite Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[
            styles.headerButton,
            { backgroundColor: scrollPosition > IMAGE_HEIGHT - 100 ? '#f0f0f0' : 'rgba(0,0,0,0.3)' }
          ]}
        >
          <FontAwesome 
            name="arrow-left" 
            size={24} 
            color={scrollPosition > IMAGE_HEIGHT - 100 ? "#333" : "#fff"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleToggleFavorite} 
          style={[
            styles.headerButton, 
            { backgroundColor: scrollPosition > IMAGE_HEIGHT - 100 ? '#f0f0f0' : 'rgba(0,0,0,0.3)' },
            isTogglePending && styles.headerButtonDisabled
          ]}
          disabled={isTogglePending}
        >
          {isTogglePending ? (
            <ActivityIndicator size="small" color={scrollPosition > IMAGE_HEIGHT - 100 ? "#333" : "#fff"} />
          ) : (
            <FontAwesome 
              name={isFavorite ? "heart" : "heart-o"} 
              size={24} 
              color={isFavorite ? "#ff4444" : (scrollPosition > IMAGE_HEIGHT - 100 ? "#333" : "#fff")}
            />
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
        >
          {allImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        <View style={styles.imageIndicators}>
          {allImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.imageIndicator,
                currentImageIndex === index && styles.imageIndicatorActive
              ]}
            />
          ))}
        </View>

        <View style={styles.content}>
          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.vendor}>{product.vendor_name}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          {/* Product Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <FontAwesome5 name="box" size={16} color="#666" />
              <Text style={styles.detailText}>Series: {product.series_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="barcode" size={16} color="#666" />
              <Text style={styles.detailText}>Code: {product.product_code}</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="layer-group" size={16} color="#666" />
              <Text style={styles.detailText}>
                Stock: <Text style={styles.stockText}>
                  {product.item_quantity > 0 ? `${product.item_quantity} available` : 'Out of stock'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewModal(true)}
              >
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            </View>

            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    {review.user.avatar_url ? (
                      <Image
                        source={{ uri: review.user.avatar_url }}
                        style={styles.reviewAvatar}
                      />
                    ) : (
                      <View style={[styles.reviewAvatar, styles.reviewAvatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                          {review.user.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.reviewUsername}>{review.user.username}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {renderStars(review.rating)}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            
            <View style={styles.ratingInput}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setRating(index + 1)}
                    >
                      <FontAwesome
                        name={index < rating ? 'star' : 'star-o'}
                        size={30}
                        color={index < rating ? '#FFD700' : '#666'}
                        style={{ marginHorizontal: 4 }}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Write your review here..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 44,
    zIndex: 100,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 60,
    zIndex: 99,
  },
  animatedHeader: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 60,
  },
  headerButtons: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 100,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.7,
  },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: IMAGE_HEIGHT - 30,
    width: '100%',
  },
  imageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  imageIndicatorActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  productInfo: {
    marginBottom: 24,
  },
  vendor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5D3F4F',
  },
  details: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#444',
  },
  stockText: {
    color: '#5D3F4F',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    backgroundColor: '#5D3F4F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewAvatarPlaceholder: {
    backgroundColor: '#5D3F4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  ratingInput: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#5D3F4F',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 