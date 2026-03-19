# Cosmic Cargo

Cosmic Cargo is an immersive, full-stack space-themed gaming platform. It features a centralized "Hangar" hub that serves as a gateway to eight unique mini-games designed to test cognitive skills, reflexes, and logic.

## Features

* **Centralized Mission Hub:** A unified navigation interface for launching games and tracking progress.
* **8 Specialized Mini-Games:**
    * **Asteroid Pop:** Fast-paced reflex challenge.
    * **Cargo Inventory:** Logic-based sorting and organization.
    * **Constellation Tracing:** Precision and pattern recognition.
    * **Launchpad:** Strategic timing and preparation.
    * **Orbiting Moons:** Physics-based spatial awareness.
    * **Rover Explorer:** Pathfinding and exploration.
    * **Satellite Sequencing:** Memory-based sequence matching.
    * **Weight Station:** Balance and mass distribution puzzles.
* **Full-Stack Architecture:** Persistent high-score tracking and user authentication.
* **Futuristic UI:** Built with Tailwind CSS and Framer Motion for smooth animations and a cohesive aesthetic.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Framer Motion (Animations)
* Lucide React (Icons)

**Backend:**
* Node.js & Express
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT) for Authentication

## Getting Started

### Prerequisites
* Node.js (v16.0.0 or higher)
* MongoDB instance (Local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bhuvanesh-sudo/cosmic-cargo.git](https://github.com/bhuvanesh-sudo/cosmic-cargo.git)
    cd cosmic-cargo
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

4.  **Environment Setup:**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5.  **Run the Application:**
    * **Start Backend:** From the `/server` folder, run `npm start`.
    * **Start Frontend:** From the root folder, run `npm run dev`.

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Shared UI (Hub, BackButton, StarField)
│   ├── games/            # Logic for all 8 mini-games
│   ├── App.jsx           # Routing and core Hub logic
│   └── main.jsx          # React entry point
├── server/
│   ├── models/           # Mongoose Schemas (User, Scores)
│   ├── routes/           # Auth and Game API endpoints
│   └── index.js          # Express server entry
└── tailwind.config.js    # Design system configuration
