import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const imageUrl = (path) => path?.startsWith('http') ? path : `${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'}${path || ''}`;
export default api;
