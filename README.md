# GitPulse 🧬

GitPulse is a premium, beautifully designed analytics dashboard for your GitHub profile. It goes beyond simple metrics, analyzing your commit history, repositories, and programming habits to extract your unique **Developer DNA**. 

![GitPulse Banner](https://via.placeholder.com/1200x400/12121f/6366f1?text=GitPulse+-+Unleash+Your+Github+DNA) <!-- Feel free to replace with an actual screenshot! -->

## ✨ Features

- **Rich Stats Dashboard**: 12 detailed metrics split across Activity, Profile, and Behavior categories (e.g., Longest Streak, Peak Day Commits, Original Repos vs Forks).
- **ML-Powered Repository Clustering**: Automatically categorizes your projects into `Production-grade`, `Learning`, or `Hobby` using K-Means clustering based on stars, forks, commit frequency, and documentation.
- **Developer DNA Scores**: 4 interactive SVG progress rings evaluating your Consistency, Diversity, Activity, and Social Impact.
- **Weekly Commit Trend**: A sleek, interactive `Recharts` AreaChart visualizing your commits over the last 52 weeks with chronological axis labels.
- **Coding Rhythm Heatmap**: A 7x24 grid sampling your recent commits to visualize your peak productivity hours and days.
- **Interactive Repository Drawer**: A gorgeous right-side slide-in panel showing the last 20 commits for any selected repository.
- **Lightning Fast**: Powered by asyncio parallel fetching and a server-side in-memory cache for near-instant repeat lookups.

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- **Styling**: Custom CSS (Glassmorphism, CSS Variables, Keyframe Animations, Responsive Grids)
- **Charts**: Recharts (Commit Trend)
- **Icons**: Lucide React

**Backend**
- Python 3.11+ / FastAPI
- **Data Gathering**: PyGithub, `asyncio`, `ThreadPoolExecutor`
- **Data Science**: `pandas`, `scikit-learn` (KMeans, StandardScaler)
- **Performance**: Simple TTL In-Memory Caching

## 🚀 Getting Started

Follow these instructions to run GitPulse on your local machine.

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.11+
- A GitHub Personal Access Token (PAT). Generate one in your GitHub Settings > Developer Settings > Personal Access Tokens (Fine-grained or Classic).

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (Command Prompt)
   venv\Scripts\activate
   # On Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your Environment Variables:
   - Create a file named `.env` inside the `backend` folder.
   - Add your GitHub token:
     ```env
     GITHUB_TOKEN=ghp_your_actual_token_here
     ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`*

### 2. Frontend Setup

1. Open a new terminal and navigate to the project root:
   ```bash
   # From the root directory (where package.json is)
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000` (or `5173` depending on your Vite config)*

### 3. Usage

1. Open `http://localhost:3000` in your web browser.
2. Enter a GitHub username (e.g., `octocat`, `torvalds`, or your own username).
3. Wait a few seconds for the machine learning model and data aggregation to complete.
4. Enjoy exploring the deep analytics and repository insights!

## 🧩 Architectural Highlights

- **Parallel API Requests**: The backend utilizes `asyncio.gather` and `asyncio.to_thread` to fetch repository limits, language bytes, and commit activity concurrently, radically reducing loading times.
- **Small Dataset Fallbacks**: The ML clustering model gracefully handles profiles with 0, 1, or 2 public repositories without breaking.
- **Premium UX**: Every interaction is animated. From the Hero text revealing itself on scroll (IntersectionObserver), to the repository list sliding in, to tooltips fading elegantly into view with CSS keyframes.

## 📝 License

This project is open-source and available under the MIT License.
