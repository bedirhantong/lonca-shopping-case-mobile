import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Product } from '../../domain/models/product.model';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { toggleFavorite } from '../../../../store/features/favoriteSlice';
import { FontAwesome } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const dispatch = useAppDispatch();
  const { items: favorites, pendingToggles } = useAppSelector((state) => state.favorites);
  
  const isFavorite = favorites.some((fav) => fav.product.id === product.id);
  const isPending = pendingToggles[product.id] || false;

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(product));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.main_image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <TouchableOpacity 
          style={[styles.favoriteButton, isPending && styles.disabledButton]} 
          onPress={handleFavoritePress}
          disabled={isPending}
        >
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={24} 
            color={isFavorite ? "#ff4444" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 24) / 2;

const styles = StyleSheet.create({
  container: {
    width: cardWidth - 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: cardWidth - 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ecc71',
  },
  favoriteButton: {
    position: 'absolute',
    top: -20,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ProductCard; 