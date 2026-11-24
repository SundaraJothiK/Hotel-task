# StayFinder — Hotel List CRUD Application

A full-stack hotel directory built to match the supplied 3-page task: React + Redux Toolkit, Node.js + Express, PostgreSQL, native SQL, local server image uploads, search, price filters, pagination, reusable add/edit form, delete confirmation/success toast, hotel detail page, map and browser geolocation, and dynamic SEO metadata.

## Requirements
- Node.js 18 or newer and npm
- PostgreSQL 14 or newer
- Visual Studio Code

## 1. Create the PostgreSQL database
1. Open pgAdmin or the PostgreSQL SQL Shell.
2. Create the database once by running `CREATE DATABASE hotel_list_db;` while connected to the default `postgres` database.
3. Connect to `hotel_list_db`, open `backend/database/schema.sql`, and run the full file to create the table and insert the six sample hotels. **Important:** Run the sample `INSERT` section only once; running it again creates duplicate sample cards.

## 2. Start the backend
Open the project folder in VS Code. Open a terminal:

```powershell
cd backend
npm install
copy .env.example .env
```
Edit `backend/.env` and replace `YOUR_PASSWORD` with your PostgreSQL password. Example:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:MyPassword@localhost:5432/hotel_list_db
CLIENT_URL=http://localhost:5173
```

Then start the API:

```powershell
npm run dev
```
If nodemon is not desired, use `npm start`. Keep this terminal running. API health check: `http://localhost:5000/api/health`.

## 3. Start the frontend
Open a **second** VS Code terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
Open the local URL printed by Vite, normally `http://localhost:5173`.

## Sample hotel content
The SQL file includes six example hotels (name, full description, latitude, longitude, price and local sample image path). Sample SVG image files are in `backend/public/sample-images`. These are served by the API at `/sample-images/...`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/hotels?search=&minPrice=&maxPrice=&offset=0&limit=4` | Search, price filter and pagination |
| GET | `/api/hotels/:id` | Hotel details |
| POST | `/api/hotels` | Create hotel; multipart form field `image` |
| PUT | `/api/hotels/:id` | Update hotel; optional multipart `image` |
| DELETE | `/api/hotels/:id` | Delete hotel and its uploaded image |

## Notes / troubleshooting
- Both backend and frontend terminals must remain running.
- If the API says PostgreSQL connection failed, check PostgreSQL service, database name, username and password in `backend/.env`.
- If port 5000 is already used, change `PORT` in `backend/.env` and update `VITE_IMAGE_BASE_URL` in `frontend/.env` to the same backend origin.
- Uploaded images are stored in `backend/uploads` on the server. The folder is created automatically. Do not store user uploads in the frontend public folder.
- The detail map uses OpenStreetMap in an iframe. The “Find my location” control asks the browser for permission and reports the current coordinates; it does not change the hotel's saved pin. Browser geolocation generally requires localhost or HTTPS.
- The included sample images are simple local SVG illustrations, so the demo works without depending on third-party image URLs. Replace them with your own hotel photos whenever you like.
- This is a development assignment starter. Before production deployment, add authentication, request rate limits, stronger operational logging, and secure secrets management.
