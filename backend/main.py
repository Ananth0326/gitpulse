# GitPulse Component
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
import traceback
from datetime import datetime
from typing import List
from dotenv import load_dotenv

from models import ProfileResponse, ReposResponse, StatsResponse, CommitItem
from github_client import GitHubClient
from analyzer import GitPulseAnalyzer

load_dotenv()

app = FastAPI(title="GitPulse API", version="1.1.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import time

client = GitHubClient()
analyzer = GitPulseAnalyzer()

# Simple in-memory cache
cache = {}

def get_cached(key):
    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < 600:  # 10 minutes
            return data
    return None

def set_cached(key, data):
    cache[key] = (data, time.time())

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.1.0"}

@app.get("/api/profile/{username}", response_model=ProfileResponse)
async def get_profile(username: str):
    cached = get_cached(f"profile:{username}")
    if cached:
        return cached
        
    print(f"Fetching profile for: {username}")
    try:
        user = client.github.get_user(username)
        # Verify user existence
        _ = user.login
        
        repos = user.get_repos(type='public')
        total_stars = sum(repo.stargazers_count for repo in repos)
        
        data = ProfileResponse(
            username=user.login,
            name=user.name,
            bio=user.bio,
            avatar_url=user.avatar_url,
            location=user.location,
            followers=user.followers,
            following=user.following,
            public_repos=user.public_repos,
            total_stars=total_stars,
            account_created_at=user.created_at.strftime("%Y-%m-%d")
        )
        set_cached(f"profile:{username}", data)
        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in profile route: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/repos/{username}", response_model=ReposResponse)
async def get_repos(username: str):
    cached = get_cached(f"repos:{username}")
    if cached:
        return cached

    print(f"Fetching repos for: {username}")
    try:
        repos_data = client.get_repos(username)
        clustered_repos = analyzer.cluster_repos(repos_data)
        data = ReposResponse(
            repos=clustered_repos,
            total_repos=len(clustered_repos)
        )
        set_cached(f"repos:{username}", data)
        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in repos route: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/commits/{username}/{repo_name}", response_model=List[CommitItem])
async def get_repo_commits(username: str, repo_name: str, per_page: int = 20):
    print(f"Fetching commits for: {username}/{repo_name}")
    try:
        commits = await asyncio.to_thread(client.get_repo_commits, username, repo_name, per_page)
        return commits
    except Exception as e:
        print(f"Error in commits route: {e}")
        raise HTTPException(status_code=500, detail="Could not load commits")

@app.get("/api/stats/{username}", response_model=StatsResponse)
async def get_stats(username: str):
    cached = get_cached(f"stats:{username}")
    if cached:
        return cached

    print(f"Fetching enhanced stats for: {username}")
    try:
        # Run in parallel
        commit_activity, lang_bytes, repos, hourly_dist = await asyncio.gather(
            asyncio.to_thread(client.get_commit_activity, username),
            asyncio.to_thread(client.get_language_bytes, username),
            asyncio.to_thread(client.get_repos, username),
            asyncio.to_thread(client.get_hourly_distribution, username)
        )
        
        breakdown = analyzer.compute_language_breakdown(lang_bytes)
        heatmap = analyzer.compute_heatmap(commit_activity)
        weekly_commits = analyzer.calculate_weekly_trend(heatmap)
        coding_hours = analyzer.process_coding_hours(hourly_dist)
        
        # summary needs heatmap for streaks and peak day
        summary = analyzer.compute_summary_stats(heatmap, repos)
        
        # Update top language from breakdown
        if breakdown:
            summary["top_language"] = breakdown[0]["language"]

        # Cluster for distribution
        clustered = analyzer.cluster_repos(repos)
        dist_list = [
            {"label": "Production-grade", "count": sum(1 for r in clustered if r["cluster_label"] == "Production-grade")},
            {"label": "Learning", "count": sum(1 for r in clustered if r["cluster_label"] == "Learning")},
            {"label": "Hobby", "count": sum(1 for r in clustered if r["cluster_label"] == "Hobby")}
        ]

        formatted_breakdown = [
            {
                "name": item["language"], 
                "bytes": item.get("bytes", 0), 
                "percentage": item["percentage"], 
                "color": item["color"]
            }
            for item in breakdown
        ]
        
        data = StatsResponse(
            summary=summary,
            languages=formatted_breakdown,
            heatmap=heatmap,
            distribution=dist_list,
            weekly_commits=weekly_commits,
            coding_hours=coding_hours,
            clusters={}
        )
        set_cached(f"stats:{username}", data)
        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in stats route: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    print("GitPulse backend running on port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
