import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: 400, borderRadius: 6 },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
});
