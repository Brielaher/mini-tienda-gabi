import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../utils/api';
import LoginScreen from './login';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
  
      const token = response.data.token;
  
      // Guardamos el token localmente
      await AsyncStorage.setItem('token', token);
  
      // Podés navegar a Home o establecer el usuario como autenticado
      console.log('Usuario registrado con éxito. Token:', token);
      LoginScreen({ user: { name, email }, token });
      //navigation.navigate('Home');
      
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      alert('Registro fallido. Revisá tus datos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
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
        style={styles.register}
        activeOpacity={0.7}
        onPress={handleRegister}
      >
        <Text style={{ color: 'white' }}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style= {styles.link}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: 'gray' }}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
    register: { 
    backgroundColor: 'black', 
    padding: 10, 
    marginTop: 20,
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
