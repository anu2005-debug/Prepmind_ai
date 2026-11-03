
cat > README.md <<'EOF'
# 🚀 PrepMind AI – Intelligent Personalized Learning Platform

PrepMind AI is an AI-powered personalized learning and practice platform designed to help students prepare for competitive examinations through intelligent recommendations, chapter-wise learning resources, and performance tracking.

The platform analyzes student performance, identifies knowledge gaps, and recommends personalized learning paths to improve preparation efficiency.

## ✨ Key Features

### 📚 Multi-Exam Support
- JEE Main
- JEE Advanced
- WBJEE
- NEET UG
- CUET UG
- BITSAT

### 🎯 Personalized Learning
- Subject-wise and chapter-wise learning.
- Learning resources and video lectures.
- Personalized study recommendations.
- Intelligent identification of weak chapters.
- Adaptive learning paths based on student performance.

### 📝 Practice & Assessment
- Subject-wise practice dashboards.
- Chapter-specific question banks.
- 30 unique practice questions per chapter.
- MCQ, multiple-correct and numerical questions.
- Practice timer and question navigation.
- Automatic evaluation and score calculation.
- Performance and progress tracking.

### 🤖 AI Recommendation Engine
- Content-based recommendation.
- Collaborative filtering.
- Hybrid recommendation model.
- Knowledge gap identification.
- Difficulty-based recommendations.
- Feedback-driven recommendation updates.

### 🔐 Student Management
- Student registration and login.
- Email-based password recovery.
- Individual student profiles.
- Learning progress tracking.

## 🧠 Recommendation Architecture

PrepMind AI combines content-based filtering and collaborative filtering to generate personalized recommendations.

**Hybrid Recommendation Score:**

Hybrid Score = (0.6 × Content Score) + (0.4 × Collaborative Score)

The system uses student interactions, learning performance, and chapter-level knowledge gaps to improve recommendations.

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- CSS
- HTML

### Backend
- Python
- FastAPI
- REST APIs

### Database
- PostgreSQL
- SQL

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Content-Based Filtering
- Collaborative Filtering
- Hybrid Recommendation

## 📂 Project Structure

```text
PrepMind-AI/
│
├── data/
│   ├── content.csv
│   ├── interactions.csv
│   └── students.csv
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── MyCourses.jsx
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── api.py
│   ├── database.py
│   ├── content_recommender.py
│   ├── collaborative_filter.py
│   ├── hybrid_recommender.py
│   ├── difficulty_engine.py
│   ├── feedback_loop.py
│   ├── knowledge_gap.py
│   └── learning_path.py
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/PrepMind-AI.git
cd PrepMind-AI
```

### 2. Backend Setup

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn psycopg2-binary pandas numpy scikit-learn python-dotenv
```

Configure your environment variables in a `.env` file.

Set up the PostgreSQL database and update the database credentials.

Start the backend:

```bash
python -m uvicorn src.api:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

If your frontend uses Vite instead of Webpack, use:

```bash
npm run dev
```

## 🔮 Future Enhancements

- AI-generated personalized study plans.
- Integration of additional learning resources.
- Advanced student performance analytics.
- Intelligent question difficulty adaptation.
- Improved recommendation accuracy.
- Deployment with cloud-based infrastructure.

## 👩‍💻 Author

**Anushka Keshri**

Computer Science & Technology

Institute of Engineering & Management, Kolkata

---

⭐ If you find this project interesting, consider giving the repository a star!
EOF


