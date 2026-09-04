# Deploying Dharohar Backend on Render 🚀

This document provides step-by-step instructions to deploy the Dharohar Express/MongoDB backend to **Render** (render.com).

---

## 1. Prerequisites Before Deploying

### A. MongoDB Atlas Network Access
Render services use dynamic IP addresses. Ensure your MongoDB Atlas cluster allows incoming connections from any IP:
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. In the left sidebar under **Security**, click **Network Access**.
3. Click **+ Add IP Address**.
4. Click **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.

---

## 2. Deploy Option A: Blueprint (Recommended - One Click)

Because we added [`render.yaml`](file:///c:/Users/HP/Desktop/dharohar/render.yaml) to your repository root:

1. Push your latest code to your GitHub / GitLab repository:
   ```powershell
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```
2. Open [dashboard.render.com](https://dashboard.render.com/).
3. Click **New +** in the top right corner and select **Blueprint**.
4. Connect your Dharohar repository.
5. Render will automatically detect `render.yaml` and read the service settings.
6. When prompted for environment variables, fill in:
   - `MONGODB_URI`: *(Your MongoDB connection string from `backend/.env`)*
7. Click **Apply**. Render will automatically build, deploy, and give you a live URL like:
   `https://dharohar-backend.onrender.com`

---

## 3. Deploy Option B: Manual Web Service

If you prefer to configure the service manually on Render:

1. Push your code to GitHub:
   ```powershell
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and pick your repo.
4. Configure the settings:
   - **Name**: `dharohar-backend`
   - **Region**: Choose the closest region (e.g., `Singapore` or `Frankfurt`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://vermaaryan8366_db_user:...@cluster0.dpwedos.mongodb.net/?appName=Cluster0` |
   | `JWT_ACCESS_SECRET` | `dharohar_super_secret_access_key_2026` |
   | `JWT_REFRESH_SECRET` | `dharohar_super_secret_refresh_key_2026` |
   | `JWT_ACCESS_EXPIRES_IN` | `15m` |
   | `JWT_REFRESH_EXPIRES_IN` | `7d` |
   *(Note: Do NOT set `PORT` manually; Render automatically assigns and manages the port.)*

6. Under **Advanced**, you can set:
   - **Health Check Path**: `/health`
7. Click **Create Web Service**.

---

## 4. Verify the Deployment

Once Render finishes building and deploying:
1. Check root URL in browser:
   `https://<your-render-subdomain>.onrender.com/`
   You should see:
   ```json
   {
     "status": "OK",
     "service": "Dharohar Cultural Ecosystem API",
     "version": "1.0.0",
     "health": "/health",
     "api": "/api/v1"
   }
   ```
2. Check health endpoint:
   `https://<your-render-subdomain>.onrender.com/health`
3. Check cities API:
   `https://<your-render-subdomain>.onrender.com/api/v1/cities`

---

## 5. Connect Mobile App to Production Backend

Once your Render backend is live:
1. In `Mobile_app/.env`, update:
   ```env
   EXPO_PUBLIC_API_URL=https://<your-render-subdomain>.onrender.com/api/v1
   ```
2. Your Expo mobile app and Android app will now communicate directly with the live cloud backend!
