import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://192.168.1.42:3000/api', //para conectar desde android
// });

// const api = axios.create({
//   baseURL: 'http://10.0.2.2:3000/api', //para conectar desde docker
// });


const api = axios.create({
  baseURL: 'http://localhost:3000/api', //para conectar local
});


export default api;