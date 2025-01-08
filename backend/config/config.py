import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

class Settings:
    # API Settings
    PORT: int = int(os.getenv('PORT', 8000))
    HOST: str = os.getenv('HOST', '0.0.0.0')
    
    # CORS Settings
    ALLOWED_ORIGINS: list = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    
    # Database Settings (if needed later)
    DB_URL: str = os.getenv('DB_URL', '')

    # Other configurations can be added here
    
settings = Settings()
