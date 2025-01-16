import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, refreshTokensStore } from '../utils/fakeDB.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { config } from '../config/dotenv.js';

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Usuário já registrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'Usuário registrado com sucesso!' });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Credenciais inválidas' });

  const accessToken = generateAccessToken({ username });
  const refreshToken = generateRefreshToken({ username });

  refreshTokensStore.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refresh = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Token necessário' });

  if (!refreshTokensStore.includes(token)) {
    return res.status(403).json({ message: 'Token inválido' });
  }

  jwt.verify(token, config.refreshTokenSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
};

export const logout = (req, res) => {
  const { token } = req.body;
  const index = refreshTokensStore.indexOf(token);

  if (index > -1) {
    refreshTokensStore.splice(index, 1);
  }

  res.status(204).send();
};