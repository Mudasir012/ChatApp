<div align="center">
  <br />
  <h1>⚡ ChatApp</h1>
  <p>
    <strong>A Premium, Real-Time Community Platform</strong>
  </p>
  <p>
    Built with the MERN stack and designed for high-performance, real-time messaging, community building, and an unparalleled user experience.
  </p>
  <br />
</div>

## ✨ The Experience

**ChatApp** isn't just another messaging clone. It's a fully realized, dark-themed platform inspired by the best aspects of Discord, featuring a sleek glassmorphic UI, buttery smooth micro-animations, and a truly premium aesthetic. 

Whether you're organizing a development sprint, building a community, or just hanging out, ChatApp provides the tools to connect seamlessly.

<br />

## 🚀 Key Features

* 🌙 **Stunning Dark Mode UI** - A carefully curated color palette featuring deep midnight blues, vibrant purples, and glassmorphic panels.
* 💬 **Real-Time Messaging** - Instantaneous chat delivery with dynamic timestamps and message grouping.
* 👥 **Group Workspaces** - Create dedicated groups, select custom emoji icons, and invite members instantly.
* 🗂 **Topic Boards** - Organize your group's conversations into specialized boards (channels) to keep things clean and focused.
* 🔍 **Smart User Search** - Find and connect with other registered users in real-time with debounced search functionality.
* 🤝 **Direct Messaging** - Start private, 1-on-1 conversations with a single click.
* 🖼 **Dynamic Profiles** - Upload your own avatar (powered by Cloudinary) and manage your custom display name and bio.
* 🔐 **Secure Authentication** - robust, session-based user authentication and route protection.

<br />

## 🛠 Tech Stack

**Frontend**
* ⚡ **Vite** + **React** - Lightning fast builds and reactive components.
* 🎨 **Vanilla CSS** - Highly optimized, custom CSS variables mapping out a scalable design system without the bloat of external libraries.

**Backend**
* 🟢 **Node.js** + **Express** - Fast, unopinionated backend architecture.
* 🗄 **MongoDB** + **Mongoose** - Flexible NoSQL database modeling for messages, users, and groups.
* ☁️ **Cloudinary** - Secure and rapid media and profile picture storage.

<br />

## 🏁 Getting Started

Want to run this locally? Follow these steps to get your own instance of ChatApp up and running.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
npm install
```

### 2. Environment Setup

Create a `.env` file inside the `Backend/` directory and populate it with your credentials:

```env
# Backend/.env

# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority

# Security
SESSION_SECRET=your_super_secret_key

# Cloudinary (for profile pictures)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for welcome/verification emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Ignite the Servers

Open two terminals to run the frontend and backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd Backend
npm run start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`! ⚡

### 4. Deploying to Vercel

This repository is ready to deploy to Vercel as a monorepo with a static frontend and a serverless backend.

1. Connect the repository to Vercel.
2. Use the root `package.json` for the frontend build.
3. Vercel will use `api/index.cjs` as the serverless backend entrypoint.
4. Add the backend environment variables in your Vercel project settings:

```text
MONGO_URL
SESSION_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_USER
EMAIL_PASS
CLIENT_ORIGIN
```

When deployed, your frontend will be served from Vercel and all `/api/*` requests will route to the backend function.

<br />

---

<div align="center">
  <p>Built with 💜 by Mudasir</p>
</div>
