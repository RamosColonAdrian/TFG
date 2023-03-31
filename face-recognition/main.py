from fastapi import FastAPI, UploadFile, Form
from Model import classifyFace
from cloudinary.uploader import upload
import cloudinary_config

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
