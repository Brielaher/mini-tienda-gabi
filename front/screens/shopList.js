import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const CartScreen = () => {
  const { cart, removeFromCart, clearCart, incrementQuantity, deleteItem } = useCart();
  const { validateToken } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      validateToken();
    }, [])
  );
  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price} x {item.quantity}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.actionButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => incrementQuantity(item)} style={styles.actionButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteItem(item)}
            style={[styles.delete, { marginLeft: 'auto' }]} 
          >
            <Ionicons name="trash-outline" style={styles.deleteButton} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      {cart.length === 0 ? (
        <Text>Tu carrito está vacío.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <Button title="Vaciar carrito" color="red" onPress={clearCart} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  cartItem: { flexDirection: 'row', marginBottom: 16 },
  image: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#666', marginVertical: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: { color: 'white', fontSize: 16 },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'right' },
  delete: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButton: {
    color: 'red',
    size: 40
  },
});

export default CartScreen;