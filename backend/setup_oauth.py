"""One-time OAuth setup script.
Run this once to authorize exHacker to create Google Slides on your behalf.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from google_auth_oauthlib.flow import InstalledAppFlow

load_dotenv(Path(__file__).parent.parent / ".env")

SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive.file",
]

client_config = {
    "installed": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost"],
    }
}

flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
creds = flow.run_local_server(port=8080, open_browser=True)

token_path = Path(__file__).parent / "token.json"
with open(token_path, "w") as f:
    f.write(creds.to_json())

print(f"\nToken saved to {token_path}")
print("You're all set! Restart the backend and run the workflow.")
