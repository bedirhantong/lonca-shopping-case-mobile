import React from 'react';
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
} from 'react-native';
import { Product } from '../../domain/models/product.model';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  isLoading?: boolean;
  onEndReached?: () => void;
  refreshControl?: React.ReactElement;
}

export default function ProductList({ 
  products, 
  onProductPress, 
  isLoading = false,
  onEndReached,
  refreshControl,
}: ProductListProps) {
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

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.list}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      initialNumToRender={6}
      refreshControl={refreshControl}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
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
}); 