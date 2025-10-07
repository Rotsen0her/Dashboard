import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pkg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'db',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// === Registro ===
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
    res.json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// === Login ===
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'No existe' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Incorrecto' });
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// === Middleware ===
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Sin token' });
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}

// === Subir wallpaper ===
app.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Archivo recibido:', req.file);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NO CONFIGURADO'
    });
    
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('Resultado de Cloudinary:', result.secure_url);
    
    await pool.query('INSERT INTO wallpapers (user_id, url) VALUES ($1, $2)', [req.user.id, result.secure_url]);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al subir imagen', error: error.message });
  }
});

// === Obtener wallpapers ===
app.get('/my-wallpapers', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT url FROM wallpapers WHERE user_id=$1', [req.user.id]);
    res.json(rows.map(r => r.url));
  } catch (error) {
    console.error('Error al obtener wallpapers:', error);
    res.status(500).json({ message: 'Error al obtener wallpapers', error: error.message });
  }
});

app.listen(4000, () => console.log('Backend en puerto 4000'));