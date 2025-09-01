# Veritas Project

A monorepo containing the Veritas application with three main components:

## Structure

- **client/** - React frontend application (Vite + Tailwind CSS)
- **server/** - Node.js backend API (Express + PostgreSQL)
- **extension/** - Browser extension

## Getting Started

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm start
```

### Extension
Load the `extension/` folder as an unpacked extension in your browser.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, PostgreSQL, bcryptjs, JWT
- **Extension**: Chrome Extension Manifest V3
