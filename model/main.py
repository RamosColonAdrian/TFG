from fastapi import FastAPI, UploadFile, Form
from Model import classifyFace
import cloudinary_config
from fastapi import File

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}



@app.post("/classify")
async def classify_controller(img: UploadFile = File(...)):
    contents = await img.read()
    res = classifyFace(contents)
    return res
    

