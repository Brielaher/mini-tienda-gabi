import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import ProductDetail from './screens/productDetail';
import RegisterScreen from './screens/register';
import ProductCard from './components/productCard';
import { CartProvider, useCart } from './context/CartContext';
import CartScreen from './screens/shopList';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = "NAVIGATION_STATE"; // Clave para almacenar el usuario en AsyncStorage
const Stack = createNativeStackNavigator();

const CartIcon = ({ navigation }) => {
  const { cart } = useCart(); // Obtiene los items en el carrito
  const itemCount = cart.length; // Cuenta los items en el carrito
  const { logout } = useAuth(); // Obtiene la función de logout del contexto de autenticación

  const handleLogout = async () => {
    try {
      await logout(); // Llama a la función de logout
      navigation.navigate('Login'); // Redirige a la pantalla de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={{ marginRight: 20 }}>
        <View>
          <Ionicons name="cart-outline" size={24} />
          {itemCount > 0 && (
            <View style={styles.cartCountContainer}>
              <Text style={styles.cartCountText}>{itemCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Ionicons name="exit-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (e) {
        console.error('Error restaurando navegación:', e);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) return null;

  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer
          initialState={initialState}
          onStateChange={(state) => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))}
        >
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
            <Stack.Screen name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerRight: () => (
                  <CartIcon navigation={navigation} />
                ),
                title: 'Volver',
              })}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={({ navigation }) => ({
                headerRight: () => (
                  <CartIcon navigation={navigation} />
                ),
                title: 'Volver',
              })}
            />

            <Stack.Screen
              name="ProductCard"
              component={ProductCard}
              options={({ navigation }) => ({
                headerRight: () => (
                  <CartIcon navigation={navigation} />
                ),
                title: 'Volver',
              })}
            />

            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={({ navigation }) => ({
                headerRight: () => (
                  <CartIcon navigation={navigation} />
                ),
                title: 'Volver',
              })}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

const styles = {
  cartCountContainer: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
};

export default App;