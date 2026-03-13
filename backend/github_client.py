import os
import time
from datetime import datetime, timedelta, timezone
from concurrent.futures import ThreadPoolExecutor
from github import Github, GithubException, RateLimitExceededException
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class GitHubClient:
    def __init__(self):
        token = os.getenv("GITHUB_TOKEN")
        if not token:
            print("WARNING: GITHUB_TOKEN not found in environment variables.")
        self.github = Github(token)

    def get_user(self, username: str):
        try:
            user = self.github.get_user(username)
            # Trigger a simple call to verify user existence
            _ = user.login
            return user
        except GithubException as e:
            if e.status == 404:
                raise HTTPException(status_code=404, detail="GitHub user not found")
            raise HTTPException(status_code=e.status, detail=str(e))
        except RateLimitExceededException:
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Try again in a minute.")

    def get_repos(self, username: str) -> list:
        user = self.get_user(username)
        repos = []
        try:
            # Get up to 30 most recently updated public repos
            public_repos = user.get_repos(type='public', sort='updated')
            
            # Fetch details in parallel
            with ThreadPoolExecutor(max_workers=10) as executor:
                repo_list = list(public_repos[:30])
                futures = [executor.submit(self._fetch_repo_details, repo) for repo in repo_list]
                for future in futures:
                    details = future.result()
                    if details:
                        repos.append(details)
            
            return repos
        except Exception as e:
            print(f"Error fetching repos for {username}: {e}")
            return []

    def _fetch_repo_details(self, repo):
        try:
            has_readme = False
            try:
                repo.get_readme()
                has_readme = True
            except:
                pass

            commit_count = self._get_commit_count(repo)
            days_since_update = (datetime.now(timezone.utc) - repo.updated_at).days

            return {
                "name": repo.name,
                "description": repo.description,
                "language": repo.language,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "commit_count": commit_count,
                "has_readme": has_readme,
                "days_since_update": days_since_update,
                "url": repo.html_url,
                "is_fork": repo.fork
            }
        except:
            return None

    def _get_commit_count(self, repo) -> int:
        # Fast path: check if stats are ready
        stats = repo.get_stats_contributors()
        if stats is not None:
            return sum(c.total for c in stats)
        
        # If not ready, one quick retry after 500ms
        time.sleep(0.5)
        stats = repo.get_stats_contributors()
        if stats is not None:
            return sum(c.total for c in stats)
            
        return 0

    def get_commit_activity(self, username: str) -> list:
        user = self.get_user(username)
        daily_commits = {}
        
        try:
            # Optimize: Only analyze top 20 most recently pushed repos for activity
            repos = list(user.get_repos(type='public', sort='pushed')[:20])
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(lambda r: r.get_stats_commit_activity(), repo) for repo in repos]
                for future in futures:
                    stats = future.result()
                    if stats:
                        for week in stats:
                            start_date = week.week
                            for i, count in enumerate(week.days):
                                if count > 0:
                                    day_date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
                                    daily_commits[day_date] = daily_commits.get(day_date, 0) + count
            
            result = [{"date": d, "count": c} for d, c in daily_commits.items()]
            return result
        except Exception as e:
            print(f"Error fetching commit activity for {username}: {e}")
            return []

    def get_language_bytes(self, username: str) -> dict:
        user = self.get_user(username)
        languages = {}
        try:
            # Optimize: Only analyze top 20 most recently pushed repos for language DNA
            repos = list(user.get_repos(type='public', sort='pushed')[:20])
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(lambda r: r.get_languages(), repo) for repo in repos]
                for future in futures:
                    repo_langs = future.result()
                    if repo_langs:
                        for lang, bytes_count in repo_langs.items():
                            languages[lang] = languages.get(lang, 0) + bytes_count
            return languages
        except Exception as e:
            print(f"Error fetching languages for {username}: {e}")
            return {}

    def get_repo_commits(self, username: str, repo_name: str, per_page: int = 20) -> list:
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            commits = repo.get_commits()
            result = []
            for i, commit in enumerate(commits):
                if i >= per_page:
                    break
                
                # author.avatar_url might be None if author is not a linked GitHub user
                author_name = "Unknown"
                author_avatar = ""
                if commit.author:
                    author_name = commit.author.login
                    author_avatar = commit.author.avatar_url
                elif commit.commit.author:
                    author_name = commit.commit.author.name
                
                result.append({
                    "sha": commit.sha,
                    "message": commit.commit.message,
                    "date": commit.commit.author.date.isoformat(),
                    "author_name": author_name,
                    "author_avatar": author_avatar
                })
            return result
        except Exception as e:
            print(f"Error fetching commits for {repo_name}: {e}")
            return []

    def get_hourly_distribution(self, username: str) -> dict:
        try:
            # Fetch last 100 commits to sample hourly distribution
            # Note: search_commits is quite powerful but has different rate limits
            query = f"author:{username}"
            commits = self.github.search_commits(query=query, sort="author-date", order="desc")
            
            distribution = {} # "day:hour": count
            count = 0
            for commit in commits:
                if count >= 100:
                    break
                
                # commit.commit.author.date is datetime
                dt = commit.commit.author.date
                day = dt.strftime("%A")
                hour = dt.hour
                key = f"{day}:{hour}"
                distribution[key] = distribution.get(key, 0) + 1
                count += 1
            
            return distribution
        except Exception as e:
            print(f"Error fetching hourly distribution: {e}")
            return {}
