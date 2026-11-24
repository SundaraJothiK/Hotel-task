import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';
const valid = (body) => {
  const { title, description, latitude, longitude, price } = body;
  if (!title?.trim() || !description?.trim()) return 'Hotel name and description are required.';
  if (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) return 'Latitude must be between -90 and 90.';
  if (!Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) return 'Longitude must be between -180 and 180.';
  if (!Number.isFinite(Number(price)) || Number(price) <= 0) return 'Price must be greater than zero.';
  return null;
};
const removeLocalImage = (imageUrl) => {
  if (imageUrl?.startsWith('/uploads/')) {
    const filePath = path.resolve('uploads', path.basename(imageUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};
export async function getHotels(req, res, next) {
  try {
    const { search = '', minPrice, maxPrice, offset = '0', limit = '6' } = req.query;
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 6, 1), 50);
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);
    const values = [`%${search}%`];
    let where = 'WHERE title ILIKE $1';
    if (minPrice !== undefined && minPrice !== '') { values.push(Number(minPrice)); where += ` AND price >= $${values.length}`; }
    if (maxPrice !== undefined && maxPrice !== '') { values.push(Number(maxPrice)); where += ` AND price <= $${values.length}`; }
    const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM hotels ${where}`, values);
    const pageValues = [...values, safeLimit, safeOffset];
    const result = await pool.query(`SELECT * FROM hotels ${where} ORDER BY created_at DESC, id DESC LIMIT $${values.length+1} OFFSET $${values.length+2}`, pageValues);
    res.json({ hotels: result.rows, total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset });
  } catch (err) { next(err); }
}
export async function getHotel(req, res, next) {
  try { const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]); if (!result.rowCount) return res.status(404).json({ message: 'Hotel not found.' }); res.json(result.rows[0]); }
  catch (err) { next(err); }
}
export async function createHotel(req, res, next) {
  try {
    const error = valid(req.body); if (error) { if (req.file) fs.unlinkSync(req.file.path); return res.status(400).json({ message: error }); }
    if (!req.file) return res.status(400).json({ message: 'Please upload a hotel image.' });
    const { title, description, latitude, longitude, price } = req.body;
    const image_url = `/uploads/${req.file.filename}`;
    const result = await pool.query('INSERT INTO hotels (title, description, latitude, longitude, price, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title.trim(), description.trim(), Number(latitude), Number(longitude), Number(price), image_url]);
    res.status(201).json(result.rows[0]);
  } catch (err) { if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); next(err); }
}
export async function updateHotel(req, res, next) {
  try {
    const error = valid(req.body); if (error) { if (req.file) fs.unlinkSync(req.file.path); return res.status(400).json({ message: error }); }
    const old = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (!old.rowCount) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ message: 'Hotel not found.' }); }
    const image_url = req.file ? `/uploads/${req.file.filename}` : old.rows[0].image_url;
    const { title, description, latitude, longitude, price } = req.body;
    const result = await pool.query('UPDATE hotels SET title=$1, description=$2, latitude=$3, longitude=$4, price=$5, image_url=$6, updated_at=NOW() WHERE id=$7 RETURNING *', [title.trim(), description.trim(), Number(latitude), Number(longitude), Number(price), image_url, req.params.id]);
    if (req.file) removeLocalImage(old.rows[0].image_url);
    res.json(result.rows[0]);
  } catch (err) { if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); next(err); }
}
export async function deleteHotel(req, res, next) {
  try { const result = await pool.query('DELETE FROM hotels WHERE id=$1 RETURNING *', [req.params.id]); if (!result.rowCount) return res.status(404).json({ message: 'Hotel not found.' }); removeLocalImage(result.rows[0].image_url); res.json({ message: 'Hotel deleted successfully.' }); }
  catch (err) { next(err); }
}
