import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // para evitar mostrar la app mientras valida token

const validateToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("No token found, logging out");
      logout();
      return false;
    }

    const response = await fetch("http://localhost:3000/api/auth/validate-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // ✅ restaurar el user
      }
      console.log("Token válido ✅");
      return true;
    } else {
      console.log("Token inválido ❌, haciendo logout");
      logout();
      return false;
    }
  } catch (error) {
    console.error("Error validando token:", error);
    logout();
    return false;
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    validateToken();
  }, []);

  const login = async (userData) => {
    await AsyncStorage.setItem("token", userData.token);
    await AsyncStorage.setItem("user", JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };
const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, validateToken, isLoggedIn  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
