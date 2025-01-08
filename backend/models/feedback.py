from pydantic import BaseModel
from typing import Optional

class Feedback(BaseModel):
    rating: int
    comment: str
    timestamp: str  # Changed from datetime to str since we're sending ISO string from frontend 