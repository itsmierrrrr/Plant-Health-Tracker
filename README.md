# Plant Health Tracker

An AI-powered plant health monitoring platform that helps users identify plants, analyze their health, detect potential issues, and receive personalized care recommendations.

The application combines **PlantNet** for plant identification with **OpenRouter-powered AI analysis** to provide detailed insights about plant condition, possible diseases, symptoms, and recommended care actions.

---

## Overview

Plant Health Tracker is designed to make plant care more accessible through computer vision and AI-assisted analysis.

Users can upload an image of a plant and receive:

* Plant species identification
* Health assessment
* Possible disease or stress detection
* Visible symptom analysis
* Personalized care recommendations
* Watering and sunlight guidance
* Health history and analysis records
* Secure user authentication

The platform provides a modern dashboard experience where users can manage their plant analyses and monitor their plants over time.

---

## Key Features

### Plant Identification

Upload a plant image and identify the most likely plant species using the **PlantNet API**.

The identification workflow provides:

* Plant name
* Scientific name
* Identification confidence
* Taxonomic information
* Candidate species when applicable

---

### AI Health Analysis

After identifying the plant, the application uses **OpenRouter** to generate a detailed health analysis.

The AI analyzes available visual information and provides insights such as:

* Overall plant health
* Potential diseases
* Nutrient deficiencies
* Pest-related symptoms
* Environmental stress
* Leaf discoloration
* Wilting or damage
* Recommended actions

The analysis is designed to assist users rather than replace professional agricultural or horticultural diagnosis.

---

### Personalized Plant Care

Based on the plant identification and analysis, users receive care recommendations covering areas such as:

* Watering
* Sunlight
* Soil requirements
* Temperature
* Humidity
* Fertilization
* Pruning
* General maintenance

---

### User Authentication

The application includes secure authentication functionality with:

* User registration
* User login
* JWT-based sessions
* Google Sign-In
* Protected routes
* Secure password handling

Google authentication uses Google's OAuth credentials on the frontend and backend token verification.

---

### Analysis History

Authenticated users can access previous plant analyses.

Each analysis can contain:

* Uploaded plant image
* Identified species
* Health score/status
* AI-generated observations
* Recommended care
* Analysis timestamp

This allows users to track changes in plant health over time.

---

### Responsive Dashboard

The frontend provides a responsive dashboard designed for desktop and mobile devices.

The interface includes:

* Dashboard overview
* Plant analysis workflow
* Health information
* Analysis history
* Plant insights
* Authentication screens
* Responsive navigation

---

## Application Flow

```text
User
 │
 ▼
Upload Plant Image
 │
 ▼
Frontend
 │
 ▼
Backend API
 │
 ├──────────────► PlantNet API
 │                  │
 │                  ▼
 │             Plant Identification
 │
 ▼
OpenRouter AI
 │
 ▼
Detailed Health Analysis
 │
 ▼
Care Recommendations
 │
 ▼
Store Analysis
 │
 ▼
MongoDB
 │
 ▼
Dashboard
```

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Axios
* CORS
* dotenv

### AI & APIs

* PlantNet API
* OpenRouter
* Google OAuth

### Deployment

The application can be deployed using services such as:

* Vercel for the frontend
* Render or similar platforms for the backend
* MongoDB Atlas for database hosting

---

## Project Architecture

```text
plant-health-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> The exact directory structure may vary depending on the implementation.

---

# API Architecture

The backend exposes REST APIs that connect the frontend with authentication, plant identification, AI analysis, and database services.

### Authentication

```text
POST /api/auth/register
```

Creates a new user account.

```text
POST /api/auth/login
```

Authenticates an existing user.

```text
POST /api/auth/google
```

Authenticates users through Google Sign-In.

---

### Plant Analysis

```text
POST /api/analyze
```

Accepts a plant image and starts the identification and health analysis process.

The backend:

1. Receives the uploaded image.
2. Sends the image to PlantNet.
3. Retrieves the predicted plant species.
4. Sends relevant information to the AI analysis service.
5. Generates health and care recommendations.
6. Stores the analysis.
7. Returns the result to the frontend.

---

### Analysis History

```text
GET /api/analysis
```

Retrieves analysis records associated with the authenticated user.

---

# Plant Identification

Plant identification is handled through the PlantNet API.

The general workflow is:

```text
Plant Image
     ↓
PlantNet API
     ↓
Species Prediction
     ↓
Scientific Name
     ↓
Identification Result
```

The returned identification is then used as additional context for the AI health analysis.

---

# AI Analysis

OpenRouter is used as the AI gateway for generating detailed plant health insights.

The AI receives relevant information such as:

* Identified plant species
* Plant image context
* Observed symptoms
* Environmental information when available

It then generates structured recommendations for the user.

Example response structure:

```json
{
  "plant": "Monstera deliciosa",
  "health": "Healthy",
  "observations": [
    "Leaves appear green and well developed",
    "No major visible signs of disease"
  ],
  "recommendations": [
    "Provide bright indirect sunlight",
    "Water when the upper soil layer becomes dry"
  ]
}
```

AI-generated results should be treated as guidance and not as a definitive diagnosis.

---

# Database

The application uses **MongoDB** for persistent data storage.

MongoDB can store:

* User accounts
* Authentication information
* Plant analyses
* Identification results
* Health assessments
* Care recommendations
* Analysis timestamps

Mongoose is used to define schemas and interact with MongoDB from the backend.

---

# Authentication & Security

The application uses multiple layers of authentication and security.

### JWT Authentication

Authenticated sessions use JSON Web Tokens.

The general flow is:

```text
Login
  ↓
Credentials Verified
  ↓
JWT Generated
  ↓
Token Sent to Client
  ↓
Protected API Request
  ↓
JWT Verification
  ↓
Authorized Request
```

### Password Security

Passwords are hashed before being stored using bcrypt.

### Google Authentication

Google Sign-In uses:

```text
Frontend Google Sign-In
        ↓
Google Credential
        ↓
Backend Verification
        ↓
User Authentication
        ↓
JWT Session
```

Sensitive credentials should never be committed to the repository.

---

# Environment Variables

Create an environment file for the required variables.

### Frontend

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend

```env
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=your_mongodb_connection_string

PLANTNET_API_KEY=your_plantnet_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Additional variables may be required depending on the backend implementation.

### Important

Never commit `.env` files or API keys to GitHub.

Add them to `.gitignore`:

```gitignore
.env
.env.local
.env.production
node_modules/
dist/
uploads/
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/plant-health-tracker.git
```

Navigate into the project:

```bash
cd plant-health-tracker
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 4. Configure Environment Variables

Create the required `.env` files and add your API credentials.

---

## 5. Start the Backend

```bash
npm run dev
```

The backend will run on the configured port, for example:

```text
http://localhost:4000
```

---

## 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The Vite development server will provide a local URL similar to:

```text
http://localhost:5173
```

---

# Production Build

Build the frontend using:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The generated production files are typically placed inside:

```text
dist/
```

---

# Deployment

## Frontend

The React/Vite frontend can be deployed using Vercel.

Configure:

```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Backend

The Express backend can be deployed using Render or another Node.js hosting platform.

Configure the production environment variables:

```env
MONGODB_URI=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
PLANTNET_API_KEY=...
OPENROUTER_API_KEY=...
```

Also configure the frontend URL in the backend CORS settings.

Example:

```text
https://your-frontend.vercel.app
```

---

# CORS Configuration

During development:

```text
Frontend
http://localhost:5173
        ↓
Backend
http://localhost:4000
```

In production:

```text
Vercel Frontend
       ↓
Render Backend
       ↓
MongoDB / External APIs
```

The backend must allow requests from the deployed frontend origin.

---

# Development Workflow

A typical development workflow looks like:

```text
1. Start MongoDB
        ↓
2. Start Express Backend
        ↓
3. Start Vite Frontend
        ↓
4. Login / Register
        ↓
5. Upload Plant Image
        ↓
6. PlantNet Identification
        ↓
7. AI Health Analysis
        ↓
8. Save Analysis
        ↓
9. Display Results
```

---

# Error Handling

The application handles common issues such as:

* Invalid image uploads
* Unsupported file formats
* API failures
* Plant identification failures
* AI service failures
* Database connection errors
* Authentication errors
* Expired JWT tokens
* CORS errors
* Missing environment variables

The frontend displays appropriate feedback instead of leaving the user with unexplained API errors.

---

# Future Improvements

Possible future enhancements include:

* Real-time plant health monitoring
* Plant-specific care reminders
* Watering notifications
* Fertilizer schedules
* Growth tracking
* Plant health charts
* Multiple plant profiles
* Disease image classification
* Pest detection
* Weather-based recommendations
* Soil moisture sensor integration
* IoT-based plant monitoring
* AI-powered plant care assistant
* Plant health trend prediction
* Offline support through PWA
* Push notifications

---

# Project Goals

The main goals of Plant Health Tracker are to:

* Simplify plant identification
* Make plant health information accessible
* Combine computer vision with generative AI
* Provide personalized plant-care guidance
* Maintain historical plant health records
* Demonstrate practical full-stack development
* Integrate third-party APIs into a production-style application

---

# Learning Outcomes

This project demonstrates practical experience with:

* React application development
* TypeScript
* REST API development
* Node.js and Express
* MongoDB and Mongoose
* Authentication and authorization
* JWT implementation
* Google OAuth
* Third-party API integration
* AI API integration
* Image upload handling
* Environment configuration
* CORS configuration
* Frontend-backend communication
* Cloud deployment
* Production debugging

---

# Security Considerations

The application follows basic security practices including:

* Environment variables for secrets
* Password hashing
* JWT-based authentication
* Backend token verification
* Protected API routes
* CORS configuration
* Input validation
* File upload validation

API keys should always remain on the backend whenever possible.

---

# Disclaimer

Plant Health Tracker provides AI-assisted information based on uploaded images and available plant data.

AI-generated results may not always be accurate and should not be considered a definitive diagnosis. For serious plant diseases, large-scale agricultural problems, or situations involving valuable crops, users should consult a qualified horticulturist, botanist, or agricultural professional.

---

# Author

**Mihir Sawant**

IT Engineering Student | Full-Stack Developer

GitHub: `https://github.com/itsmierrrrr`

LinkedIn: `https://linkedin.com/in/mihirsawantxo`

---

# License

This project is intended for educational and development purposes.

Add an appropriate open-source license such as MIT if you intend to allow others to use, modify, and distribute the project.

---

## Plant Pulse

**Plant Health Tracker. Smart care for every plant.**

Built with React, Node.js, MongoDB, PlantNet, and AI.
