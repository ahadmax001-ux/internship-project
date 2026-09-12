# 🎓 ATP Score Management and Calculation System (MERN Stack)

A modern, responsive, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built for college academic evaluation and ATP (Academic / Attendance-Theory-Practical) score calculation.

---

## 🌟 Highlights & Features

- **⚡ Configurable Calculation Engine**: Formula logic is strictly isolated in `server/utils/atpCalculator.js`. Modify parameters, weights, or math equations in one place without touching React components or database models.
- **🎨 Modern Tailwind CSS UI**: Fully responsive across mobile phones, tablets, laptops, and desktop screens with custom progress gauges and contribution bars.
- **🚀 Single-Command Startup**: Root `package.json` with `concurrently` launches both Express backend and React Vite frontend together (`npm run dev`).
- **💾 MongoDB & Mongoose Integration**: Stores student details, input parameters, final score, grade, and breakdown, with an in-memory session mode if local MongoDB is offline.
- **🔍 Score History & Analytics**: Search, grade filter, single-record inspection modal, deletion, and batch statistics (average score, pass rate, highest score).
- **🧪 Sample Data Included**: Pre-configured college test records ready for immediate presentation and viva demonstration.

---

## 📁 Project Architecture & Directory Structure

```
ATP-Score/
│
├── package.json                   # Root package: concurrently dev script
├── .gitignore                     # Git ignore rules
├── README.md                      # Complete setup & rubric guide
│
├── server/                        # Express.js Backend
│   ├── package.json               # Backend dependencies
│   ├── .env.example               # Environment template
│   ├── .env                       # Local environment variables
│   ├── server.js                  # Express app entry point
│   ├── config/
│   │   └── db.js                  # MongoDB connection with fallback
│   ├── models/
│   │   └── ATPRecord.js           # Mongoose schema for score records
│   ├── utils/
│   │   └── atpCalculator.js       # ⚠️ ISOLATED CALCULATION ENGINE
│   ├── controllers/
│   │   └── atpController.js       # REST controllers (calculate, save, history, delete)
│   ├── routes/
│   │   └── atpRoutes.js           # Express REST endpoints
│   └── data/
│       └── sampleData.json        # Preloaded sample student test data
│
└── client/                        # React.js Frontend (Vite)
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite config with backend proxy
    ├── index.html                 # HTML shell with Inter font
    ├── tailwind.config.js         # Tailwind styling configuration
    ├── postcss.config.js          # PostCSS configuration
    └── src/
        ├── index.css              # Tailwind base styles & animations
        ├── main.jsx               # React entry point
        ├── App.jsx                # Coordinator layout & state
        ├── services/
        │   └── api.js             # REST API communication client
        ├── utils/
        │   └── formulaConfig.js   # Parameter definitions & sample presets
        └── components/
            ├── Navbar.jsx         # Header & mobile drawer
            ├── Sidebar.jsx        # Navigation & session metrics
            ├── Footer.jsx         # College project footer
            ├── InputField.jsx     # Validated numeric input component
            ├── ATPForm.jsx        # Input form with instant validation
            ├── ScoreCard.jsx      # Radial progress score display
            ├── ScoreBreakdown.jsx # Parameter contribution bars
            ├── ResultCard.jsx     # Result summary & actions
            ├── HistoryTable.jsx   # Searchable records table + modal
            ├── Dashboard.jsx      # Analytics overview & quick links
            └── AboutModal.jsx     # Formula rubric documentation
```

---

## ⚙️ REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & MongoDB connectivity check |
| `GET` | `/api/atp/specs` | Get parameter weights, limits, and formula metadata |
| `POST` | `/api/atp/calculate` | Calculate score preview without saving to database |
| `POST` | `/api/atp` | Calculate score and save new student record |
| `GET` | `/api/atp` | Get all records with optional `?search=` and `?grade=` |
| `GET` | `/api/atp/:id` | Get single record details |
| `DELETE`| `/api/atp/:id` | Delete record by ID |

---

## ⚠️ How to Replace with Your Official College ATP Formula

The ATP calculation logic is kept in **one standalone file**:
📂 [`server/utils/atpCalculator.js`](file:///c:/Users/ahadm/OneDrive/Desktop/ATP%20SCORE/server/utils/atpCalculator.js)

### Default 100-Point Formula Used:
$$ATP\ Score = (Attendance \times 10\%) + (Theory_1 \times 17.5\%) + (Theory_2 \times 17.5\%) + (Practical \times 25\%) + (Project \times 20\%) + (ContinuousAssessment \times 10\%)$$

### To Change the Formula:
1. Open `server/utils/atpCalculator.js`.
2. Locate the banner:
   ```javascript
   /* ============================================================
      REPLACE WITH OFFICIAL ATP FORMULA
      ============================================================ */
   ```
3. Update the weights in `ATP_PARAMETER_SPECS` or the formula inside `calculateATPScore(inputData)`:
   ```javascript
   const calculateATPScore = (inputData = {}) => {
     // Your college formula here:
     // e.g. const finalScore = (inputData.attendance * 0.2) + (inputData.theoryScore1 * 0.8);
   };
   ```
4. Save the file. The server automatically updates via `nodemon`!

---

## 🛠️ Installation & Running the Project

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (optional; if MongoDB is not running, the system will seamlessly run in session mode with test data)

### Step 1: Install Dependencies
From the root directory:
```bash
# Install root, backend, and frontend packages
npm run install:all
```
*(Or install each directory individually)*:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 2: Environment Variables
Create or verify `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/atp_score_db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Run the Application
From the root project folder:
```bash
npm run dev
```

This single command starts:
- 🚀 **Backend Server**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

---

## 📱 Responsive Testing
- **Desktop / Laptop**: Full sidebar navigation, side-by-side calculation form and radial score card, expanded history table.
- **Tablet**: Adaptive 2-column parameter inputs with touch-friendly controls.
- **Mobile Phone**: Collapsible hamburger menu, stacked cards, touch-optimized inputs, and card-based history view.
