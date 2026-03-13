# GitPulse Component
from pydantic import BaseModel
from typing import List, Optional

class ProfileResponse(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: str
    location: Optional[str] = None
    followers: int
    following: int
    public_repos: int
    total_stars: int
    account_created_at: str

class RepoItem(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stars: int
    forks: int
    commit_count: int
    has_readme: bool
    days_since_update: int
    url: str
    cluster_label: str  # Production-grade / Learning / Hobby

class ReposResponse(BaseModel):
    repos: List[RepoItem]
    total_repos: int

class LanguageBreakdown(BaseModel):
    name: str
    bytes: int
    percentage: float
    color: str

class CommitItem(BaseModel):
    sha: str
    message: str
    date: str
    author_name: str
    author_avatar: str

class CommitDay(BaseModel):
    date: str  # YYYY-MM-DD
    count: int

class ClusterDistItem(BaseModel):
    label: str
    count: int

class StatsSummary(BaseModel):
    total_commits: int
    avg_commits_per_week: float
    most_active_day: str
    most_active_month: str
    current_streak: int
    longest_streak: int
    active_weeks: int
    peak_day_commits: int
    total_stars: int
    total_forks: int
    original_repos: int
    avg_commits_per_repo: float
    top_language: str

class StatsResponse(BaseModel):
    summary: StatsSummary
    languages: List[LanguageBreakdown]
    heatmap: List[CommitDay]
    distribution: List[ClusterDistItem]
    weekly_commits: List[int]
    coding_hours: Optional[dict] = None
    clusters: dict = {}
