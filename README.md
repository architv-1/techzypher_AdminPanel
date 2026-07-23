# 🛡️ TechZypher Admin Panel CMS

A modern, high-performance **Content Management System (CMS) & Dashboard** built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, **React Router v7**, and **Lucide React**.

This project provides a complete administration suite for managing digital content including **Job Careers**, **Blog Articles**, **Company Services**, and **Team Professionals**. It supports both full backend API integration and an interactive client-side UI fallback powered by `localStorage`.

---

## 📁 Comprehensive File & Folder Structure

```text
Admin Panel/
├── index.html                  # Main HTML entry point
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration (React + Tailwind v4 plugins)
├── eslint.config.js            # Code linting & formatting standards
├── README.md                   # Project documentation & structure reference
│
└── src/                        # Main Application Source Code
    ├── main.jsx                # Application root mounting & BrowserRouter provider
    ├── App.jsx                 # Top-level Routing setup (Login, Signup, Dashboard)
    ├── index.css               # Global Tailwind CSS imports (@import "tailwindcss";)
    ├── App.css                 # Base application styling
    │
    └── adminDashborad/         # Admin Panel Feature Module
        ├── AdminDashboard.jsx  # Main Dashboard container & internal sub-router
        ├── AdminLayout.jsx     # Master layout (Responsive sidebar, navbar, user profile)
        ├── AdminOverview.jsx   # Metrics overview cards & quick-start tips
        ├── AdminLogin.jsx      # Restricted admin authentication page
        ├── AdminSignup.jsx     # Admin registration setup page
        ├── ProtectedAdminRoute.jsx # Authentication guard wrapper for secured routes
        ├── useAdminAuth.js     # Custom Hook for Auth state (localStorage & API fallback)
        │
        └── cms/                # CMS Content Management Modules
            ├── BlogsManager.jsx         # CRUD Manager for Blog Posts
            ├── CareersManager.jsx       # CRUD Manager for Job Careers
            ├── ServicesManager.jsx      # CRUD Manager for Services
            └── ProfessionalsManager.jsx # CRUD Manager for Team Professionals
```

---

## 📂 Detailed Module Breakdown

### 🔹 Root Configuration Files
* **[index.html](file:///c:/Users/Archit/Desktop/Admin%20Panel/index.html)**: HTML setup with standard viewport and font scaling.
* **[package.json](file:///c:/Users/Archit/Desktop/Admin%20Panel/package.json)**: Configured with React 19, Vite, `@tailwindcss/vite`, `framer-motion`, `lucide-react`, and `react-router-dom`.
* **[vite.config.js](file:///c:/Users/Archit/Desktop/Admin%20Panel/vite.config.js)**: Vite configuration utilizing `@vitejs/plugin-react` and `@tailwindcss/vite`.

### 🔹 Application Core (`src/`)
* **[main.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/main.jsx)**: Mounts `<App />` wrapped with `<BrowserRouter>`.
* **[App.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/App.jsx)**: Defines public routes (`/admin/login`, `/admin/signup`) and protected routes (`/admin/dashboard/*`).
* **[index.css](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/index.css)**: Implements Tailwind CSS v4 styling rules.

### 🔹 Dashboard & Auth (`src/adminDashborad/`)
* **[AdminDashboard.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/AdminDashboard.jsx)**: Sub-router rendering the overview and CMS managers inside `AdminLayout`.
* **[AdminLayout.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/AdminLayout.jsx)**: Provides a responsive glassmorphic sidebar, top navigation bar, mobile drawer, active tab indicator, and logout trigger.
* **[AdminOverview.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/AdminOverview.jsx)**: Displays total counts for job listings, blog posts, services, and operational tips.
* **[AdminLogin.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/AdminLogin.jsx)**: Form with error handling and password visibility toggle.
* **[AdminSignup.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/AdminSignup.jsx)**: Account creation page with validation rules.
* **[ProtectedAdminRoute.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/ProtectedAdminRoute.jsx)**: Security guard preventing unauthorized navigation.
* **[useAdminAuth.js](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/useAdminAuth.js)**: Custom hook providing `login`, `logout`, and `checkAuth` logic.

### 🔹 CMS Managers (`src/adminDashborad/cms/`)
* **[BlogsManager.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/cms/BlogsManager.jsx)**: Manage blog articles with title, category, thumbnail preview, description, content, and creation date.
* **[CareersManager.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/cms/CareersManager.jsx)**: Manage open positions with job title, employment type badges, location, and salary ranges.
* **[ServicesManager.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/cms/ServicesManager.jsx)**: Manage core business services with custom ordering and description text.
* **[ProfessionalsManager.jsx](file:///c:/Users/Archit/Desktop/Admin%20Panel/src/adminDashborad/cms/ProfessionalsManager.jsx)**: Manage team members with avatar image positioning (`top`/`center`), roles, bio, and social links (LinkedIn, Twitter, GitHub).

---

## 🗺️ Application Route Map

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `Navigate` | Redirects to `/admin/dashboard` |
| `/admin/login` | `AdminLogin` | Restricted Admin Login Screen |
| `/admin/signup` | `AdminSignup` | Admin Account Setup Screen |
| `/admin/dashboard` | `AdminOverview` | Metrics & Dashboard Analytics |
| `/admin/dashboard/careers` | `CareersManager` | Careers & Job Listings Management |
| `/admin/dashboard/blogs` | `BlogsManager` | Blog Posts & Articles Management |
| `/admin/dashboard/services` | `ServicesManager` | Business Services Management |
| `/admin/dashboard/professionals` | `ProfessionalsManager` | Team Members & Executives Management |

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## ✨ Features & Highlights

- 🎨 **Dark-Mode Glassmorphic Aesthetics**: Modern dark theme with subtle glows and responsive layouts.
- ⚡ **Pure UI Execution Support**: Automatically falls back to `localStorage` when backend APIs are offline.
- 📸 **Instant Image Upload**: Native `FileReader` Data URL previews for local testing.
- 🔔 **Toast Notifications**: Smooth visual feedback for all Create, Update, and Delete actions.
