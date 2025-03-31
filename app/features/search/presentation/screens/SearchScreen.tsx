import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { searchProducts, setQuery, clearSearch, setFilters, clearFilters } from '../../../../store/features/searchSlice';
import ProductList from '../../../products/presentation/components/ProductList';
import { router } from 'expo-router';
import { Product } from '../../../products/domain/models/product.model';
import SearchEmptyState from '../components/SearchEmptyState';
import { SearchFilters } from '../../domain/models/search.model';
import debounce from 'lodash/debounce';

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const { results, isLoading, filters } = useAppSelector((state) => state.search);
  const [searchText, setSearchText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);

  // Animation value for search bar
  const searchBarAnimation = new Animated.Value(1);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(searchBarAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(searchBarAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Apply filters to results
  useEffect(() => {
    let filtered = [...results];

    // Apply vendor name filter
    if (filters.vendor_name) {
      filtered = filtered.filter(product => 
        product.vendor_name.toLowerCase().includes(filters.vendor_name!.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.min_price !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.max_price!);
    }

    // Apply sorting
    if (filters.sort_field) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sort_field) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'created_at':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
        }
        return filters.sort_order === 'desc' ? -comparison : comparison;
      });
    }

    setFilteredResults(filtered);
  }, [results, filters]);

  const debouncedSearch = debounce((text: string, searchFilters: SearchFilters) => {
    if (text.trim()) {
      dispatch(searchProducts({ query: text, filters: searchFilters }));
    } else {
      dispatch(clearSearch());
    }
  }, 500);

  const handleSearch = (text: string) => {
    setSearchText(text);
    debouncedSearch(text, filters);
  };

  const handleClearSearch = () => {
    setSearchText('');
    dispatch(clearSearch());
    dispatch(clearFilters());
    setTempFilters(filters);
    Keyboard.dismiss();
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(tempFilters));
    setShowFilters(false);
    if (searchText) {
      dispatch(searchProducts({ query: searchText, filters: tempFilters }));
    }
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/modals/product-detail',
      params: { id: product.id }
    });
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter & Sort</Text>
          
          <ScrollView>
            {/* Vendor Name Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Vendor Name</Text>
              <TextInput
                style={styles.filterInput}
                value={tempFilters.vendor_name}
                onChangeText={(text) => setTempFilters({ ...tempFilters, vendor_name: text })}
                placeholder="Enter vendor name"
              />
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  value={tempFilters.min_price?.toString()}
                  onChangeText={(text) => setTempFilters({ ...tempFilters, min_price: Number(text) || undefined })}
                  placeholder="Min"
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  value={tempFilters.max_price?.toString()}
                  onChangeText={(text) => setTempFilters({ ...tempFilters, max_price: Number(text) || undefined })}
                  placeholder="Max"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortOptionsContainer}>
                {['price', 'name', 'created_at'].map((field) => (
                  <TouchableOpacity
                    key={field}
                    style={[
                      styles.sortOption,
                      tempFilters.sort_field === field && styles.sortOptionActive
                    ]}
                    onPress={() => setTempFilters({ ...tempFilters, sort_field: field as SearchFilters['sort_field'] })}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      tempFilters.sort_field === field && styles.sortOptionTextActive
                    ]}>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sortOrderContainer}>
                {['asc', 'desc'].map((order) => (
                  <TouchableOpacity
                    key={order}
                    style={[
                      styles.sortOption,
                      tempFilters.sort_order === order && styles.sortOptionActive
                    ]}
                    onPress={() => setTempFilters({ ...tempFilters, sort_order: order as 'asc' | 'desc' })}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      tempFilters.sort_order === order && styles.sortOptionTextActive
                    ]}>
                      {order === 'asc' ? 'Ascending' : 'Descending'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setTempFilters(filters);
                setShowFilters(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.searchContainer,
          { transform: [{ translateY: searchBarAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0]
          })}] }
        ]}
      >
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchText ? (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            Boolean(filters.vendor_name || filters.min_price || filters.max_price || filters.sort_field || filters.sort_order) && styles.filterButtonActive
          ]}
          onPress={() => setShowFilters(true)}
        >
          <MaterialCommunityIcons 
            name="filter-variant" 
            size={24} 
            color={Boolean(filters.vendor_name || filters.min_price || filters.max_price || filters.sort_field || filters.sort_order) ? "#fff" : "#5D3F4F"} 
          />
        </TouchableOpacity>
      </Animated.View>

      {isLoading && !filteredResults.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3F4F" />
        </View>
      ) : searchText && !filteredResults.length ? (
        <SearchEmptyState onClear={handleClearSearch} />
      ) : (
        <ProductList
          products={filteredResults}
          onProductPress={handleProductPress}
          isLoading={isLoading}
          showSearch={false}
        />
      )}

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#5D3F4F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sortOrderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 8,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: '#5D3F4F',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
  },
  sortOptionTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
  applyButton: {
    backgroundColor: '#5D3F4F',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 