import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity, AppState } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import ProductDetail from './screens/productDetail';
import RegisterScreen from './screens/register';
import ProductCard from './components/productCard';
import CartScreen from './screens/shopList';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const PERSISTENCE_KEY = "NAVIGATION_STATE";
const Stack = createNativeStackNavigator();

const CartIcon = ({ navigation }) => {
  const { cart } = useCart();
  const itemCount = cart.length;
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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

const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => <CartIcon navigation={navigation} />,
              title: 'Volver',
            })}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={({ navigation }) => ({
              headerRight: () => <CartIcon navigation={navigation} />,
              title: 'Volver',
            })}
          />
          <Stack.Screen
            name="ProductCard"
            component={ProductCard}
            options={({ navigation }) => ({
              headerRight: () => <CartIcon navigation={navigation} />,
              title: 'Volver',
            })}
          />
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={({ navigation }) => ({
              headerRight: () => <CartIcon navigation={navigation} />,
              title: 'Volver',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const MainApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const { validateToken } = useAuth();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        if (state !== undefined) setInitialState(state);
      } catch (e) {
        console.error('Error restaurando navegación:', e);
      } finally {
        setIsReady(true);
      }
    };
    restoreState();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        validateToken(); // 👈 vuelve a validar el token
      }
    });
    return () => subscription.remove();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <AppNavigator />
    </NavigationContainer>
  );
};

// ⬇️ AHORA envolvés todo acá correctamente
const App = () => (
  <AuthProvider>
    <CartProvider>
      <MainApp />
    </CartProvider>
  </AuthProvider>
);

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
