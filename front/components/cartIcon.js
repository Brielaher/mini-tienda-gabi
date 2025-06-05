import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const navigation = useNavigation();
  const { cart } = useCart();

  const itemCount = useMemo(() => {
    return cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
      <View style={styles.container}>
        <Icon name="cart-outline" size={28} color="#000" />
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CartIcon); // <- esto evita rerenders innecesarios

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
