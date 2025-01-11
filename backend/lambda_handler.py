from mangum import Mangum
# Import your existing FastAPI app from main.py
from main import app

# Create the handler
handler = Mangum(app)
