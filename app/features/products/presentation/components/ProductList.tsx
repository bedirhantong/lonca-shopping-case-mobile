import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Product } from '../../domain/models/product.model';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { searchProducts, setQuery, clearSearch } from '../../../../store/features/searchSlice';
import debounce from 'lodash/debounce';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  isLoading?: boolean;
  onEndReached?: () => void;
  refreshControl?: React.ReactElement;
  showSearch?: boolean;
}

const ProductList = ({ 
  products, 
  onProductPress, 
  isLoading = false,
  onEndReached,
  refreshControl,
  showSearch = false,
}: ProductListProps) => {

  const displayedProducts = products;

  // Log products data
  console.log('\n📦 ProductList Render:', {
    productsCount: products.length,
    firstProduct: products[0],
    lastProduct: products[products.length - 1],
  });

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onProductPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.main_image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.vendorName}>{item.vendor_name.toUpperCase()}</Text>
        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.stock}>
            {item.item_quantity > 0 ? `${item.item_quantity} left` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      {showSearch}
      <FlatList
        data={displayedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.list,
          displayedProducts.length === 0 && styles.emptyList
        ]}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          (isLoading) ? (
            <ActivityIndicator size="large" color="#5D3F4F" style={styles.loader} />
          ) : null
        )}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={6}
        refreshControl={refreshControl }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop : 16,
    paddingBottom : 60
  },
  emptyList: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  cardContent: {
    padding: 12,
  },
  vendorName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D3F4F',
  },
  stock: {
    fontSize: 12,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#5D3F4F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProductList; 