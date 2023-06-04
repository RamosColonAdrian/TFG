from fastapi import FastAPI, UploadFile, Form
from Model import classifyFace, reloadModel
import cloudinary_config
from fastapi import File, HTTPException

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/classify")
async def classify_controller(img: UploadFile = File(...)):
    contents = await img.read()
    res = classifyFace(contents)
    return res

@app.post("/reload-model")
async def reload_model():
    reloadModel()
    return "Modelo recargado"

    

