# Controlador de la API REST para clasificar imagenes de rostros
from fastapi import FastAPI, UploadFile, File
from model import classifyFace, reloadModel
import cloudinary_config

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Recibe una imagen y ejecuta el reconocimiento de rostros
@app.post("/classify")
async def classify_controller(img: UploadFile = File(...)):
    contents = await img.read()
    res = classifyFace(contents)
    return res

# Recarga el modelo de reconocimiento de rostros con las imagenes de cloudinary
@app.post("/reload-model")
async def reload_model():
    reloadModel()
    return "Modelo recargado"


    


