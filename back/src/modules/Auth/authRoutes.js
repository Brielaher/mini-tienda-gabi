const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../modules/Auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');


router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile)

router.get('/validate-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token faltante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
});
module.exports = router;
