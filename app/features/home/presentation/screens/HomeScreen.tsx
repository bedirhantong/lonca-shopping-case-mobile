import { StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ProductUseCase } from '../../../products/domain/usecases/product.usecase';
import { Product } from '../../../products/domain/models/product.model';
import ProductList from '../../../products/presentation/components/ProductList';
import { Text } from '../../../../components/Themed';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const productUseCase = new ProductUseCase();

  const loadProducts = async (pageNumber: number = 1, shouldRefresh: boolean = false) => {
    try {
      if (shouldRefresh) {
        setRefreshing(true);
      }
      const response = await productUseCase.getProducts({ page: pageNumber, limit: 100 });
      if (response.success) {
        const newProducts = response.data.items;
        if (shouldRefresh) {
          setProducts(newProducts);
          setPage(1);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        setHasMore(response.data.hasNextPage);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadProducts(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/modals/product-detail',
      params: { id: product.id }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isLoading && !refreshing && products.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductList
        products={products}
        onProductPress={handleProductPress}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#5D3F4F']}
            tintColor="#5D3F4F"
          />
        }
        showSearch={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
}); 