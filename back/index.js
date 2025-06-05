const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./src/modules/Auth/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./src/modules/Products/productsRoutes');
app.use('/api/products', productRoutes);

// Inicio
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});


