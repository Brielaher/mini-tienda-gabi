import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const api = axios.create({
//   baseURL: 'http://192.168.1.42:3000/api', //para conectar desde android
// });

// const api = axios.create({
//   baseURL: 'http://10.0.2.2:3000/api', //para conectar desde docker
// });


const api = axios.create({
  baseURL: 'http://localhost:3000/api', //para conectar local
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);


export default api;