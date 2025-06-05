import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth(); // obtengo la funcion de login del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      // guardo el token localmente
      await AsyncStorage.setItem('token', token); // guardo el token localmente
      await AsyncStorage.setItem('email', email); // guardo el email localmente
      login({ email, token }); // le paso al contexto el usuario logueado y el token
      console.log('Login realizado con éxito. Token:', token);
      //redirijo a home
      navigation.navigate('Home');

    } catch (error) {
      console.error('Error en el login:', error.response?.data || error.message);
      alert('Login fallido. Datos incorrectos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.maintitle}>Hanger</Text>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.login}
        activeOpacity={0.7}
        onPress={handleLogin}>
        <Text style={{ color: 'white', fontSize: 16 }}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: 'gray' }}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  maintitle: {
    fontSize: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  login: { 
    backgroundColor: 'black', 
    padding: 10, 
    marginTop: 20,
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
