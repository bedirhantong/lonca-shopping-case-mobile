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
  const dispatch = useAppDispatch();
  const { query, results, isLoading: isSearching } = useAppSelector((state) => state.search);
  const [searchText, setSearchText] = useState('');

  const debouncedSearch = debounce((text: string) => {
    dispatch(searchProducts(text));
  }, 500);

  const handleSearch = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
    dispatch(clearSearch());
  };

  const displayedProducts = searchText ? results : products;

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

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {searchText ? (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <FontAwesome5 name="times" size={16} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading || isSearching) return null;
    if (searchText && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="search" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No products found</Text>
          <TouchableOpacity onPress={handleClearSearch} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {showSearch && renderSearchBar()}
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
        onEndReached={!searchText ? onEndReached : undefined}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={() => (
          (isLoading || isSearching) ? (
            <ActivityIndicator size="large" color="#5D3F4F" style={styles.loader} />
          ) : null
        )}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={6}
        refreshControl={!searchText ? refreshControl : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  list: {
    padding: 16,
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
    height: CARD_WIDTH * 1.3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    marginBottom: 8,
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