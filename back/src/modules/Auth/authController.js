const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../Users/usersData');

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Verificar si ya existe
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  // Encriptar contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Crear nuevo usuario
  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);

  // Generar JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  return res.status(201).json({ token });
  };

exports.login = (req, res) => {
    const { email, password } = req.body;
  
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
  
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  
    // Generar token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    
    return res.status(200).json({ token });
  };

exports.getProfile = (req, res) => {
    const { id, name, email } = req.user;
    res.json({ id, name, email });
  };
