import jwt from 'jsonwebtoken';
import { config } from '../config/dotenv.js';

export const generateAccessToken = (user) =>
  jwt.sign(user, config.accessTokenSecret, { expiresIn: '15m' });

export const generateRefreshToken = (user) =>
  jwt.sign(user, config.refreshTokenSecret);