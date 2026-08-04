# 💳 InclusivePay - Accessible UPI & Digital Wallet Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-InclusivePay-brightgreen?style=for-the-badge&logo=render)](https://inclusive-pay.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

> **InclusivePay** is an enterprise-grade, accessible UPI digital wallet and payment web application designed to bridge the accessibility gap in digital payments. Built with WCAG 2.1 AAA compliance principles, it offers high-contrast accessibility modes, interactive screen reader voice assistance, font scaling, and seamless authentication.

🌐 **Live Website**: [https://inclusive-pay.onrender.com/](https://inclusive-pay.onrender.com/)  

---

## ✨ Key Features

- 👁️ **Accessibility First (WCAG 2.1 AAA)**: High Contrast theme toggle, dynamic text scaling (90%–130%), and clear typography designed for visually impaired users.
- 🔊 **Built-in Voice Reader**: Text-to-Speech (TTS) engine providing real-time screen audio assistance and feedback for all interactive elements.
- 🔐 **Dual Authentication System**:
  - Google One-Tap & Popup authentication via **Firebase Auth**.
  - Secure local account registration & login with **MongoDB Atlas**, **BcryptJS** password hashing, and **JWT** session tokens.
- 📱 **Android App Download Hub**: Direct download access for the native Android InclusivePay APK.
- 💼 **Digital Wallet & Dashboard**: Financial overview, transaction history, profile management, and quick payment actions.
- 🛡️ **Enterprise Security**: Protected by `helmet`, CORS headers, rate-limiting on authentication routes, and secure environment isolation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 & Custom CSS Design System
- **Icons**: Lucide React
- **Auth**: Firebase Web SDK (v10)

### Backend
- **Server**: Node.js & Express.js (v5)
- **Database**: MongoDB Atlas via Mongoose
- **Security & Auth**: JWT (JSON Web Tokens), BcryptJS, Helmet, Express Rate Limit, CORS

### Hosting & Deployment
- **Frontend**: Render Static Site (with SPA Rewrite Rules)
- **Backend**: Render Web Service (Node.js)

---

## 📁 Repository Structure

```text
Inclusive-Pay/
├── public/                 # Static assets & icons
├── server/                 # Express backend application
│   ├── middleware/         # Auth & security middlewares
│   ├── models/             # Mongoose schemas (User, etc.)
│   ├── .env                # Backend environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express API server entry point
├── src/                    # React frontend application
│   ├── components/         # Modular UI components (Home, Auth, Wallet, etc.)
│   ├── context/            # Global React Contexts (AuthContext, AccessibilityContext)
│   ├── config.js           # App configuration & Firebase settings
│   ├── App.jsx             # Main application layout & routing
│   └── main.jsx            # Application root entry point
├── index.html              # HTML5 template
├── package.json            # Frontend dependencies & scripts
├── vite.config.js          # Vite build & local server proxy setup
└── README.md               # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Abhay71044/Inclusive-Pay-.git
   cd Inclusive-Pay-
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

---

### Configuration (.env)

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd server
   node server.js
   ```
   *Backend running on `http://localhost:5000`*

2. **Start the Frontend Development Server** (in a new terminal):
   ```bash
   npm run dev
   ```
   *Frontend running on `http://localhost:3000`*

---

## ☁️ Deployment Guide (Render)

### 1. Backend Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Set `MONGODB_URI` and `JWT_SECRET`.

### 2. Frontend Static Site
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects / Rewrites Rule**:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`

---

👨‍💻 **Developed by   Shivansh Saxena,Abhay Singh,Parth Sarthi and Sambhav Goel**
