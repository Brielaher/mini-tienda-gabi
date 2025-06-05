import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //no logueado
  const [loading, setLoading] = useState(true); // para evitar el parpadeo mientras carga

  // Cargar el usuario logueado al iniciar la aplicación
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error cargando usuario:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error("Error al guardar sesión:", e);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token"); // eliminar el token
    await AsyncStorage.removeItem("email"); // eliminar el usuario
    setUser(null);
  };

    if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
