# Access The Website through here

https://nutri-care-psi.vercel.app/

# Nutri-Care AI 🥗🤖

> **Smart Nutrition. Real Impact.** A comprehensive, full-stack AI ecosystem designed to automate precision meal tracking and deliver customized dietary strategies tailored to individual health metrics and goals.

---

## 🚀 Overview

**Nutri-Care AI** is an intelligent health ecosystem built to revolutionize personal nutrition management. The platform features a highly interactive, responsive frontend paired with a multi-service backend architecture. By leveraging a dedicated Python AI engine, Nutri-Care AI evaluates unique user profiles, biometric data, and personal health goals to dynamically generate data-driven dietary charts and actionable wellness insights in real time.

This project showcases a complete full-stack engineering lifecycle, spanning modular UI development, secure API development, database persistence, and isolated microservice processing.

---

## 🛠️ Tech Stack & System Architecture

The application is engineered using a robust, decoupled three-tier microservices architecture spread across dedicated repositories for maximum scalability and separation of concerns:

```text
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│   React.js Frontend    │ ───>  │   Core Central Backend  │ ───>  │   Python AI Engine     │
│  (Tailwind + Motion)   │ <───  │   (Auth, Logic, DB)    │ <───  │   (Diet Algorithms)    │
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘
```

---

## 1. Frontend Client (**nutricare-frontend**)

o Framework: React.js (Functional components, Hooks, and modern state management)

o Styling: Tailwind CSS (Utility-first, fully custom color schemas)

o Animations: Framer Motion (Smooth, physics-based viewport transitions and interactive states)

o Routing: React Router DOM (Dynamic declarative client-side routing)

---

## 2. Core Backend API (**nutricare-backend**)

o Role: Central orchestration server handling user authentication, data validation, business logic execution, and database persistence.

o Integrations: Acts as the primary gateway, securely proxying processed client payloads to the analytical Python engine.

### API Routes Documentation

Use the following format to document each backend route in full detail.

#### Authentication Routes

##### `POST /api/auth/register`

- **Description:** Creates a new user account.
- **Auth:** No
- **Request Body:**

```json
{
  "name": "Suvajit Roy",
  "email": "user@example.com",
  "password": "********"
}
```

- **Success Response:**

```json
{
  "message": "User registered successfully",
  "user": {},
  "token": "jwt_token_here"
}
```

##### `POST /api/auth/login`

- **Description:** Authenticates a user and returns an access token.
- **Auth:** No
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

- **Success Response:**

```json
{
  "message": "Login successful",
  "user": {},
  "token": "jwt_token_here"
}
```

##### `GET /api/auth/me`

- **Description:** Returns the currently authenticated user.
- **Auth:** Yes
- **Headers:**

```http
Authorization: Bearer <token>
```

#### User Routes

##### `PUT /api/users/profile`

- **Description:** Updates user profile and nutrition metrics.
- **Auth:** Yes
- **Request Body:**

```json
{
  "name": "Suvajit Roy",
  "age": 28,
  "weight": 72,
  "height": 175,
  "activityLevel": "moderate"
}
```

#### Meal Plan Routes

##### `POST /api/meal-plans/generate`

- **Description:** Generates a nutrition plan based on user goals and biometric data.
- **Auth:** Yes
- **Request Body:**

```json
{
  "goals": ["fat-loss", "muscle-gain"],
  "allergies": ["peanuts"],
  "preferences": ["high-protein", "low-carb"]
}
```

- **Success Response:**

```json
{
  "plan": {},
  "macros": {},
  "recommendations": []
}
```

##### `GET /api/meal-plans/history`

- **Description:** Returns previously generated meal plans.
- **Auth:** Yes

#### AI / Insight Routes

##### `POST /api/chat/insights`

- **Description:** Sends nutrition-related input to the AI engine for analysis.
- **Auth:** Yes
- **Request Body:**

```json
{
  "prompt": "Suggest a balanced meal plan for today.",
  "metrics": {
    "age": 28,
    "weight": 72,
    "activityLevel": "moderate"
  }
}
```

#### Dashboard Routes

##### `GET /api/dashboard/summary`

- **Description:** Returns overview statistics for the dashboard.
- **Auth:** Yes

---

### Route Documentation Template

Use this template for any additional API route you want to add:

#### `METHOD /api/your-route`

- **Description:** Explain what the route does.
- **Auth:** Yes / No
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**

```json
{
  "field": "value"
}
```

- **Success Response:**

```json
{
  "message": "Success"
}
```

- **Error Responses:**
  - `400 Bad Request` — Invalid input
  - `401 Unauthorized` — Missing or invalid token
  - `500 Internal Server Error` — Server failure

---

## 3. Python AI Backend (nutricare-ai-python)

o Role: Dedicated data microservice engineered explicitly to process dietary logic, parse user biometric constraints, and run predictive AI algorithms that
output structural nutrition plans.

---

## ✨ Key Features

o AI-Driven Dietary Generation: Processes multi-point user data (age, weight, activity levels, allergies, goals) to build immediate, customized macro and micro-nutrient dietary plans.

o Responsive UX/UI Design: An ultra-modern web dashboard optimized seamlessly for ultra-wide desktop monitors down to compact mobile viewports.

o Immersive Interactive States: Leverages smooth stagger animations, spring physics icons, and clean layout motions to optimize user retention and engagement.

o Dynamic Dark Theme Ecosystem: Includes a fully integrated night mode toggle ensuring high accessibility across different lighting environments.

---

## 📂 Repository & Project Structure

The architecture is split into three core modules for clean maintainability:

```text
├── nutricare-frontend/      # React SPA UI client
│   ├── src/
│   │   ├── assets/          # Static media, images, and brand logos
│   │   ├── components/      # Reusable global layout items (Navbar, Footer)
│   │   ├── pages/           # Routed view pages (Home, About, Dashboard)
│   │   └── App.jsx          # Main application entry and routing config
│   ├── package.json
│   └── tailwind.config.js
│
├── nutricare-backend/       # Central orchestration server
│   ├── src/
│   │   ├── config/          # Database connections and server settings
│   │   ├── controllers/     # Core business logic processing
│   │   ├── models/          # Data schemas and entities
│   │   └── routes/          # RESTful API endpoints
│   └── server.js
│
└── nutricare-ai-python/     # Python AI microservice
```

---

## ⚙️ Local Setup & Installation

To spin up the entire ecosystem locally for development, clone the repositories and follow these steps in order:

- Prerequisites
  - Node.js (v18+ recommended)
  - React (v19+)
  - Tailwind CSS (v4+)
  - nodemon
  - Package manager: npm

---

## Step 1: Initialize the Core Backend Server

Open a new terminal window, navigate to the central backend server, configure environment variables, install node packages, and start the runtime:

cd nutricare-backend
npm install
npm start

The central orchestration server will boot up (typically on http://localhost:8080).

---

## Step 2: Launch the Frontend Client

Open a third terminal window, navigate to the React application directory, install dependencies, and run the Vite/CRA development bundle:

cd nutricare-frontend
npm install
npm run dev

Open your browser and navigate to http://localhost:5173 (or the terminal specified URL) to view the live application.

---

## 🗺️ Development Roadmap

[x] Architect decoupled multi-service backend infrastructure.

- [x] Build component-driven React application layout with custom Framer Motion dynamics.
- [x] Build and integrate analytical Python nutrition calculation scripts.
- [x] Design and implement global accessible Dark Theme configuration layout.
- [ ] Implement robust user authentication tracking tokens (JWT).
- [ ] Connect production-grade caching layer for instant structural history retrieval.
- [ ] Add PDF generation automation download tools for user dietary logs.

---

## 👥 Team & Acknowledgments

- Suvajit Roy — Lead Full-Stack Architect & Core Developer

  --> Fully responsible for the end-to-end software development lifecycle, system design patterns, database modeling, and central codebase creation across all frontend and backend services.

- Contributors

  --> Dedicated appreciation to the collaborating developers who assisted with integration testing routines and contributed to implementing the global dark theme UI environment.

---

## 📄 License

Copyright (c) 2026 Suvajit Roy. All Rights Reserved.

This software and all associated configuration files are entirely proprietary and confidential. Unauthorized copying, modification, structural distribution, clone hosting, or reverse engineering of this codebase, via any electronic or physical medium, is strictly prohibited.

Permission is granted solely for viewing the underlying source code for educational review, peer architecture analysis, or portfolio engineering assessment purposes.
