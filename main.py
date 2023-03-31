from fastapi import FastAPI, File, UploadFile, Form
from Model import classifyFace
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import cloudinary_config
import cloudinary
from typing import Annotated 
import io
from PIL import Image

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload")
async def create_upload(img: UploadFile, id: str = Form()):
    response = img.file
    result = upload(response, public_id="face_recognition/" + id)
    return result

@app.post("/classify")
async def classify_controller(img: UploadFile):
    contents = img.file
    res = classifyFace(contents)
    return res
