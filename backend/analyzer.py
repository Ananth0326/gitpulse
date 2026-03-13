# GitPulse Component
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime, timedelta

LANGUAGE_COLORS = {
    "Python": "#3b82f6",
    "JavaScript": "#eab308",
    "TypeScript": "#06b6d4",
    "Java": "#f97316",
    "C++": "#ec4899",
    "C": "#8b5cf6",
    "Go": "#06b6d4",
    "Rust": "#f97316",
    "HTML": "#ef4444",
    "CSS": "#a78bfa",
    "Shell": "#22c55e",
    "Other": "#6366f1"
}

DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

class GitPulseAnalyzer:
    def compute_language_breakdown(self, language_bytes: dict) -> list:
        if not language_bytes:
            return []
        
        total_bytes = sum(language_bytes.values())
        if total_bytes == 0:
            return []
            
        breakdown = []
        for lang, b in language_bytes.items():
            assert isinstance(b, int), f"Expected int, got {type(b)} for {lang}"
            percentage = round((b / total_bytes) * 100, 1)
            
            if percentage >= 0.1:
                breakdown.append({
                    "language": lang,
                    "percentage": percentage,
                    "bytes": b,
                    "color": LANGUAGE_COLORS.get(lang, LANGUAGE_COLORS["Other"])
                })
        
        breakdown.sort(key=lambda x: x["percentage"], reverse=True)
        
        if len(breakdown) > 7:
            top_n = breakdown[:7]
            others_pct = sum(item["percentage"] for item in breakdown[7:])
            others_bytes = sum(item["bytes"] for item in breakdown[7:])
            top_n.append({
                "language": "Other",
                "percentage": round(others_pct, 1),
                "bytes": others_bytes,
                "color": LANGUAGE_COLORS["Other"]
            })
            return top_n
        
        return breakdown

    def cluster_repos(self, repos: list) -> list:
        if not repos: return []
        if len(repos) == 1:
            repos[0]["cluster_label"] = "Production-grade"
            return repos
        if len(repos) == 2:
            repos[0]["cluster_label"] = "Production-grade"
            repos[1]["cluster_label"] = "Learning"
            return repos

        try:
            df = pd.DataFrame(repos)
            df['has_readme_int'] = df['has_readme'].astype(int)
            df['activity_score'] = 1 / (df['days_since_update'] + 1)
            df['desc_len'] = df['description'].apply(lambda x: len(x) if x else 0)

            features_cols = ['stars', 'forks', 'commit_count', 'has_readme_int', 'activity_score', 'desc_len']
            X = df[features_cols]
            
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
            df['cluster'] = kmeans.fit_predict(X_scaled)
            
            centroids = df.groupby('cluster')[features_cols].mean()
            # Logic to Map clusters to names
            prod_cluster = centroids[['stars', 'commit_count', 'has_readme_int']].sum(axis=1).idxmax()
            hobby_cluster = centroids[['stars', 'commit_count', 'activity_score']].sum(axis=1).idxmin()
            
            remaining = [i for i in range(3) if i not in [prod_cluster, hobby_cluster]]
            learning_cluster = remaining[0] if remaining else (prod_cluster + 1) % 3
            
            cluster_map = {
                prod_cluster: "Production-grade",
                hobby_cluster: "Hobby",
                learning_cluster: "Learning"
            }
            
            for i, repo in enumerate(repos):
                c_idx = df.iloc[i]['cluster']
                repo["cluster_label"] = cluster_map.get(c_idx, "Learning")
        except Exception as e:
            print(f"Clustering failed: {e}")
            for i, repo in enumerate(repos):
                repo["cluster_label"] = ["Production-grade", "Learning", "Hobby"][i % 3]
            
        return repos

    def compute_heatmap(self, commit_activity: list) -> list:
        today = datetime.now().date()
        date_map = {}
        if commit_activity:
            for item in commit_activity:
                if isinstance(item, dict) and 'date' in item:
                    date_map[item['date']] = item.get('count', 0)
        
        heatmap = []
        for i in range(364, -1, -1): # Changed to 365 days, sorted oldest to newest
            d = today - timedelta(days=i)
            d_str = d.strftime("%Y-%m-%d")
            heatmap.append({
                "date": d_str,
                "count": date_map.get(d_str, 0)
            })
        
        return heatmap

    def calculate_streaks(self, heatmap: list) -> tuple:
        """Returns (current_streak, longest_streak)"""
        if not heatmap:
            return 0, 0
        
        # heatmap is sorted oldest to newest
        counts = [day['count'] for day in heatmap]
        
        longest = 0
        current = 0
        
        # Find longest streak
        temp_longest = 0
        temp_current = 0
        for c in counts:
            if c > 0:
                temp_current += 1
                temp_longest = max(temp_longest, temp_current)
            else:
                temp_current = 0
        longest = temp_longest
        
        # Find current streak (working backwards from the last day)
        # We allow for the current day to be 0 as long as yesterday has commits,
        # but typical streaks count up to today.
        current = 0
        for c in reversed(counts):
            if c > 0:
                current += 1
            else:
                # If we're at the very end and it's today, we might wait 1 day of inactivity
                if current == 0:
                    # check if the last 0 is just "today" and hasn't broken the streak yet
                    continue 
                break
        
        # Refined current streak: if last few days are 0, streak is broken. 
        # If the very last day (today) is 0, we can check yesterday.
        streak_broken = False
        streak_val = 0
        # If today has commits:
        if counts[-1] > 0:
            for c in reversed(counts):
                if c > 0: streak_val += 1
                else: break
        # If today is 0 but yesterday has commits, streak is still alive
        elif counts[-2] > 0:
            for c in reversed(counts[:-1]):
                if c > 0: streak_val += 1
                else: break
        else:
            streak_val = 0

        return streak_val, longest

    def calculate_weekly_trend(self, heatmap: list) -> list:
        """Aggregates 365 days into 52 weeks"""
        if not heatmap:
            return [0] * 52
        
        # heatmap should be 365 days (oldest to newest)
        counts = [day['count'] for day in heatmap]
        
        weekly = []
        # 365 days is slightly more than 52 weeks (364 days). 
        # We'll take the LAST 364 days for exactly 52 weeks.
        sample = counts[-364:]
        for i in range(0, 364, 7):
            week_sum = sum(sample[i:i+7])
            weekly.append(week_sum)
            
        return weekly

    def compute_summary_stats(self, heatmap: list, repos: list) -> dict:
        total_commits = sum(item['count'] for item in heatmap) if heatmap else 0
        total_repos = len(repos) if repos else 0
        
        current_streak, longest_streak = self.calculate_streaks(heatmap)
        
        # Calculate active weeks (out of 52)
        weekly = self.calculate_weekly_trend(heatmap)
        active_weeks = sum(1 for w in weekly if w > 0)
        
        # Peak commits in a day
        peak_day_commits = max([d['count'] for d in heatmap]) if heatmap else 0
        
        # Aggregate stats from repos
        total_stars = sum(r.get('stars', 0) for r in repos)
        total_forks = sum(r.get('forks', 0) for r in repos)
        original_repos_count = sum(1 for r in repos if not r.get('is_fork', False))
        
        if not heatmap or total_commits == 0:
            return {
                "total_commits": total_commits,
                "most_active_day": "Not enough data",
                "most_active_month": "Not enough data",
                "avg_commits_per_week": 0.0,
                "current_streak": 0,
                "longest_streak": 0,
                "active_weeks": 0,
                "peak_day_commits": 0,
                "total_stars": total_stars,
                "total_forks": total_forks,
                "original_repos": original_repos_count,
                "avg_commits_per_repo": round(total_commits / total_repos, 1) if total_repos > 0 else 0.0,
                "top_language": "None"
            }
            
        try:
            df = pd.DataFrame(heatmap)
            df['date'] = pd.to_datetime(df['date'])
            df['day_name'] = df['date'].dt.strftime("%A")
            df['month_name'] = df['date'].dt.strftime("%B")
            
            most_active_day = df.groupby('day_name')['count'].sum().idxmax()
            most_active_month = df.groupby('month_name')['count'].sum().idxmax()
            
            return {
                "total_commits": total_commits,
                "most_active_day": str(most_active_day),
                "most_active_month": str(most_active_month),
                "avg_commits_per_week": round(total_commits / 52, 1),
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "active_weeks": active_weeks,
                "peak_day_commits": peak_day_commits,
                "total_stars": total_stars,
                "total_forks": total_forks,
                "original_repos": original_repos_count,
                "avg_commits_per_repo": round(total_commits / total_repos, 1) if total_repos > 0 else 0.0,
                "top_language": "Unknown" # Will be updated in main.py
            }
        except Exception as e:
            print(f"Summary stats calculation error: {e}")
            return {
                "total_commits": total_commits,
                "most_active_day": "Not enough data",
                "most_active_month": "Not enough data",
                "avg_commits_per_week": 0.0,
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "active_weeks": active_weeks,
                "peak_day_commits": peak_day_commits,
                "total_stars": total_stars,
                "total_forks": total_forks,
                "original_repos": original_repos_count,
                "avg_commits_per_repo": round(total_commits / total_repos, 1) if total_repos > 0 else 0.0,
                "top_language": "None"
            }

    def process_coding_hours(self, distribution: dict) -> dict:
        """Converts raw Day:Hour map into a flat dict for frontend easy access"""
        if not distribution:
            return None
        
        # We need to ensure we return a format the frontend can easily map over.
        # Let's return the identical map for now, frontend will handle the 7x24 grid logic.
        return distribution
