import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext'; // Importa el contexto de autenticación
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth(); // Obtengo el usuario logueado del contexto de autenticación

    // Cargar el carrito del usuario al iniciar la aplicación
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                try {
                    const storedCart = await AsyncStorage.getItem(`cart_${user.email}`);
                    if (storedCart) {
                        setCart(JSON.parse(storedCart));
                        console.log('Carrito cargado:', JSON.parse(storedCart));
                    }
                } catch (error) {
                    console.error('Error al cargar el carrito:', error);
                }
            }
        }
        loadCart();
    }, [user]);

    // Guardar el carrito del usuario al cambiar
    useEffect(() => {
        const saveCart = async () => {
            if (user) {
                try {
                    await AsyncStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
                } catch (error) {
                    console.error('Error al guardar el carrito:', error);
                }
            }
        }
        saveCart();
    }, [cart, user]);


    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            return prevCart
                .map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0);
        });
    };

    const incrementQuantity = (product) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });
    };

    const deleteItem = (product) => {
        setCart(prevCart => {
            return prevCart.filter(item => item.id !== product.id);
        });
    };

    const clearCart = () => {
        setCart([]);
    };


    const saveCartForUser = async (email, cart) => {
        try {
            await AsyncStorage.setItem(`cart_${email}`, JSON.stringify(cart));
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, incrementQuantity, deleteItem, saveCartForUser }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};