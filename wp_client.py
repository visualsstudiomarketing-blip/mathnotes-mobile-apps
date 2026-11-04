import base64
import requests
from typing import Optional, Dict, Any, List

SITE_URL = "https://mathnotes.courses"
USERNAME = "webxprodigital@gmail.com"
APP_PASSWORD = "ZXux Xhzh T78p 2Vkz wQID mK9p"

class WordPressClient:
    def __init__(self, site_url: str = SITE_URL, username: str = USERNAME, app_password: str = APP_PASSWORD):
        self.site_url = site_url.rstrip("/")
        self.api_base = f"{self.site_url}/wp-json"
        
        credentials = f"{username}:{app_password}"
        token = base64.b64encode(credentials.encode()).decode("utf-8")
        
        self.headers = {
            "Authorization": f"Basic {token}",
            "User-Agent": "Antigravity/1.0",
            "Accept": "application/json"
        }

    def get_me(self) -> Dict[str, Any]:
        """Fetch authenticated user details."""
        resp = requests.get(f"{self.api_base}/wp/v2/users/me?context=edit", headers=self.headers, timeout=15)
        resp.raise_for_status()
        return resp.json()

    def get_posts(self, per_page: int = 10, status: str = "publish") -> List[Dict[str, Any]]:
        """Fetch posts."""
        resp = requests.get(f"{self.api_base}/wp/v2/posts", headers=self.headers, params={"per_page": per_page, "status": status}, timeout=15)
        resp.raise_for_status()
        return resp.json()

    def create_post(self, title: str, content: str, status: str = "draft") -> Dict[str, Any]:
        """Create a new post."""
        payload = {"title": title, "content": content, "status": status}
        resp = requests.post(f"{self.api_base}/wp/v2/posts", headers=self.headers, json=payload, timeout=15)
        resp.raise_for_status()
        return resp.json()

    def get_tutor_courses(self) -> List[Dict[str, Any]]:
        """Fetch Tutor LMS courses."""
        # Tutor LMS courses custom post type 'courses'
        resp = requests.get(f"{self.api_base}/wp/v2/courses", headers=self.headers, timeout=15)
        if resp.status_code == 200:
            return resp.json()
        # Fallback to tutor custom endpoint if available
        resp = requests.get(f"{self.api_base}/tutor/v1/courses", headers=self.headers, timeout=15)
        resp.raise_for_status()
        return resp.json()

if __name__ == "__main__":
    client = WordPressClient()
    me = client.get_me()
    print(f"Connected to {SITE_URL} as {me.get('name')} ({me.get('roles')})")
