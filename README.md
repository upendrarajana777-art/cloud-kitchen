# Cloud Kitchen - Monorepo Structure

## 📁 Project Structure

```
CK/
├── client/              # React Frontend (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/              # Express Backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── package.json         # Root - runs both client & server
└── README.md
```

## 🚀 Quick Start

### 1. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `server/.env`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cloudkitchen
PORT=5000
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install express mongoose cors dotenv
```

### 3. Configure Frontend API

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

From the **root directory**:

```bash
# Run both client and server together
npm run dev

# Or run separately:
npm run client   # Frontend only (port 5173)
npm run server   # Backend only (port 5000)
```

## 🔐 Firebase Setup (Auth Only)

Firebase is used **only** for authentication:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** providers:
   - ✅ Email/Password
   - ✅ Phone
3. Enable **Storage** for image uploads
4. Credentials are already in `client/src/lib/firebase.js`

## 🗄️ Tech Stack

**Frontend (`client/`):**
- React 18 + Vite
- TailwindCSS
- Firebase Auth
- Axios

**Backend (`server/`):**
- Node.js + Express
- MongoDB + Mongoose
- CORS

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

- **Users**: `POST /users`, `GET /users/:uid`
- **Food**: `GET /food`, `POST /food`, `PUT /food/:id`, `DELETE /food/:id`
- **Orders**: `GET /orders`, `POST /orders`, `PATCH /orders/:id/status`

## 🎯 Features

- ✅ Firebase Phone OTP + Email Auth
- ✅ MongoDB Atlas for data storage
- ✅ Real-time order updates
- ✅ Admin dashboard (food & order management)
- ✅ Shopping cart
- ✅ Image uploads (Firebase Storage)

## 📝 Development Workflow

1. **Frontend development**: `cd client && npm run dev`
2. **Backend development**: `cd server && npm run dev`
3. **Full stack**: From root: `npm run dev`

## 🔧 Scripts

**Root:**
- `npm run dev` - Run both client & server
- `npm run client` - Run frontend only
- `npm run server` - Run backend only

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production

**Server:**
- `npm start` - Start Express server
- `npm run dev` - Start with nodemon (auto-reload)
