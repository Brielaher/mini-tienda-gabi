// screens/Home.js

import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../utils/api';
import ProductCard from '../components/productCard';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { validateToken } = useAuth();
  
  useFocusEffect(
    React.useCallback(() => {
      validateToken();
    }, [])
  );

  useEffect(() => {
    API.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }


  return (
    <View style={styles.container}>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ProductCard product={item} index={index} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
