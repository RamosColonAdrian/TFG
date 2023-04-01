import cloudinary
import os 
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
  cloud_name = "dqrqizfkt",
  api_key = os.environ.get("CLOUDINARY_API_KEY"),
  api_secret = os.environ.get("CLOUDINARY_SECRET"),
  secure = True
)