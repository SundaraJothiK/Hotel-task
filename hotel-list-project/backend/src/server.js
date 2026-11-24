import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import hotelRoutes from './routes/hotelRoutes.js';
import { pool } from './config/db.js';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/sample-images', express.static(path.resolve('public/sample-images')));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Hotel API is running' }));
app.use('/api/hotels', hotelRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(err.status || 500).json({ message: err.message || 'Internal server error.' }); });
const port = process.env.PORT || 5000;
try { await pool.query('SELECT 1'); console.log('PostgreSQL connected'); }
catch (err) { console.error('Could not connect to PostgreSQL. Check DATABASE_URL and run database/schema.sql.', err.message); }
app.listen(port, () => console.log(`Hotel API listening at http://localhost:${port}`));
