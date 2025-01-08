from datetime import datetime
from pydantic import BaseModel

class Feedback(BaseModel):
    rating: int
    comment: str
    timestamp: str  # Keep as string to match frontend
    request_id: str = None  # For tracking requests
    client_ip: str = None   # For usage monitoring 