from github import Github
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
token = os.getenv("GITHUB_TOKEN")
g = Github(token)
user = g.get_user("google")
repo = user.get_repos()[0]
stats = repo.get_stats_commit_activity()
if stats:
    week = stats[0]
    print(f"Week type: {type(week.week)}")
    print(f"Week value: {week.week}")
else:
    print("No stats returned")
