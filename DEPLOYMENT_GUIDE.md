# DarziAtDoor Deployment Guide 🚀

Congratulations on completing the development of DarziAtDoor! The application is fully responsive, secure, and production-ready.

Below are the step-by-step instructions to get your application live.

## Phase 1: Database (MongoDB Atlas)

Your database currently runs locally or via a generic connection. We need a live cluster.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a New Cluster (the free `M0` tier is perfect).
3. Under **Database Access**, create a new Database User. **Save the username and password**.
4. Under **Network Access**, hit `Add IP Address`. Select `Allow Access From Anywhere` (`0.0.0.0/0`) so your cloud backend can talk to it.
5. Click **Connect** on your cluster, select **Drivers**, and copy the `Connection String`.
6. It will look like `mongodb+srv://<username>:<password>@cluster...`. Replace the `<password>` with the password you made measuring step 3.

## Phase 2: Backend Deployment (Render.com)

We will use Render because it natively supports Node.js web services perfectly.

1. Push your entire `darziatdoor` folder to a GitHub Repository.
2. Sign up at [Render.com](https://render.com/) using your GitHub account.
3. Click `New+` and select **Web Service**.
4. Select `Build and deploy from a Git repository` and connect your GitHub repo.
5. **Configuration Details**:
   - Name: `darziatdoor-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Scroll down to **Environment Variables** and expand the panel. Input:
   - `MONGO_URI`: (Paste the connection string from Phase 1)
   - `JWT_SECRET`: (Type any random 32-character string, e.g. `d7f8g9h0j1k2l3m4n5o6p7q8r9s0t1u2`)
   - `NODE_ENV`: `production`
   - *(Note: We will add `FRONTEND_URL` in a minute)*
7. Click **Create Web Service**. It will take 2-4 minutes to deploy.
8. Once live, copy your new backend URL from Render (it will look like `https://darziatdoor-backend.onrender.com`).

## Phase 3: Frontend Deployment (Vercel)

Vercel is the premier host for Vite/React applications.

1. Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **Add New Project** and select your `darziatdoor` repository.
3. **Configuration Details**:
   - Framework Preset: `Vite`
   - Root Directory: click Edit and select `frontend`!
4. Expand the **Environment Variables** section and inject:
   - Name: `VITE_API_URL`
   - Value: `https://darziatdoor-backend.onrender.com/api` (Use the url you got at the end of Phase 2! Make sure `/api` is at the end).
5. Hit **Deploy**.
6. When Vercel finishes, they will give you a live frontend URL (e.g., `https://darziatdoor.vercel.app`).

## Phase 4: Final LinkUp

We have to tell the backend to allow your shiny new Vercel domain!

1. Go back to Render.com -> your web service -> **Environment**.
2. Add a new variable:
   - `FRONTEND_URL`: `https://your-vercel-domain.vercel.app` (Paste the exact URL from Phase 3).
3. Save, which forces Render to restart.

**You are done! 🎉 Navigate to your Vercel URL on your phone or laptop. Welcome to the production build of DarziAtDoor!**
