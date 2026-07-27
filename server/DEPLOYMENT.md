# Ember & Oak - Production Deployment Guide

This guide walks you through deploying the Ember & Oak application stack across **MongoDB Atlas** (Database), **Render** (Backend API), and **Netlify** (Frontend Client).

---

## 🍃 Step 1: Set Up MongoDB Atlas

1. **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create an account.
2. **Create a Cluster**: Click **Build a Database**, select the free **M0 Sandbox** tier, and choose your preferred region.
3. **Database User**: Navigate to **Database Access** -> **Add New Database User**.
   - Create a username and strong password.
   - Assign the **Read and write to any database** privilege.
4. **Network Access**: Navigate to **Network Access** -> **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) for cloud deployment compatibility.
5. **Get Connection String**:
   - Click **Database** -> **Connect** -> **Drivers**.
   - Copy the URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ember_oak?retryWrites=true&w=majority`.
   - Replace `<username>` and `<password>` with your database user credentials.

---

## 🚀 Step 2: Deploy Backend to Render

1. **GitHub Repository**: Push your codebase (`server` directory) to GitHub.
2. **Create Web Service**:
   - Log in to [Render](https://render.com).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
3. **Configure Build Settings**:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Configure Environment Variables**: Add the following keys under **Environment**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ember_oak?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<your_secure_random_32_char_string>`
   - `JWT_EXPIRES_IN`: `7d`
   - `JWT_COOKIE_EXPIRES_IN`: `7`
   - `GOOGLE_CLIENT_ID`: `<your_google_oauth_client_id>`
   - `CLIENT_URL`: `https://your-app-name.netlify.app`
5. **Deploy & Seed**:
   - Render will build and launch your service.
   - Run seed once via Shell or local machine pointing `MONGO_URI` to Atlas: `npm run seed`.

---

## 🌐 Step 3: Deploy Frontend to Netlify

1. **Build Environment Setup**:
   - Ensure `client/package.json` build command is `npm run build`.
2. **Deploy on Netlify**:
   - Log in to [Netlify](https://netlify.com).
   - Click **Add new site** -> **Import an existing project** -> **GitHub**.
   - Select your repository.
3. **Configure Build Settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
4. **Configure Environment Variables**:
   - Add `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
5. **Deploy Site**: Click **Deploy**. Your Ember & Oak frontend is live!
