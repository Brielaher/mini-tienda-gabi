// screens/ProductDetail.js

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const ProductDetail = ({ route }) => {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigation = useNavigation();
  const { validateToken } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      validateToken();
    }, [])
  );
  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!user) {
      navigation.replace('Login'); // O 'LoginScreen', según cómo hayas nombrado tu ruta
    }
  }, [user]);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, user]);

  if (!user) return null;

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  } 

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>No hay productos para mostrar.</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    addToCart(productWithQuantity);
    alert(`${product.name} añadido al carrito!`);
  };


  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setQuantity(prev => prev - 1)} style={styles.actionButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)} style={styles.actionButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.add}
        activeOpacity={0.7}
        onPress={handleAddToCart}>
        <Text style={{ color: 'white', fontSize: 16 }}>Añadir al carrito</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 500, borderRadius: 10, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, color: '#666', marginVertical: 8 },
  description: { fontSize: 16, lineHeight: 22 },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  add: {
    backgroundColor: 'black',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: { color: 'white', fontSize: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },

});
