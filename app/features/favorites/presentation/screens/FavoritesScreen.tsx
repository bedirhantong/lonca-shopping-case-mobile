import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  Text,
  RefreshControl
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchFavorites } from '../../../../store/features/favoriteSlice';
import ProductList from '../../../products/presentation/components/ProductList';
import { router } from 'expo-router';
import { Product } from '../../../products/domain/models/product.model';

const logoImage = require('../../../../../assets/images/logo.png');

export default function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.favorites);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = () => {
    dispatch(fetchFavorites());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchFavorites());
    setRefreshing(false);
  };

  useEffect(() => {
    loadFavorites();
  }, [dispatch]);

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/modal',
      params: { id: product.id }
    });
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={logoImage}
          style={styles.emptyLogo}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Start exploring and add some products to your favorites!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductList
        products={items.map(favorite => favorite.product)}
        onProductPress={handleProductPress}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#5D3F4F']}
            tintColor="#5D3F4F"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  emptyLogo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
}); 