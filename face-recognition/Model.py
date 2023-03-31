import cv2
import numpy as np
import face_recognition as fr
import os
import cloudinary_config
import cloudinary
import cloudinary.api 
import requests
import time


path = 'Personal'
images = []
classNames = []
myList = os.listdir(path)

# store the start time
start_time_stamp =  time.time()

cloudinary_images = []
folder_name = "face_recognition"
resources = cloudinary.api.resources(type="upload", prefix=folder_name)

for resource in resources['resources']:
    url = resource['url']
    filename = resource['public_id']
    image = cloudinary.utils.cloudinary_url(url)[0]
    image_data = requests.get(image).content
    cloudinary_images.append([filename, image_data])


for image in cloudinary_images:
    #Leemoos las imagenes de la carpeta
    imgdb = cv2.imdecode(np.frombuffer(image[1], np.uint8), cv2.IMREAD_UNCHANGED)
    images.append(imgdb)
    #Obtenemos el nombre de la imagen
    classNames.append(os.path.splitext(image[0])[0])
    

#Funcion para codificar los rostros
def codrostros(images):
    listaCod = []
    for img in images:
        #Convertimos a RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        #Codificamos
        cod = fr.face_encodings(img)[0]
        #Almacenamos
        listaCod.append(cod)

    return listaCod

rostroscod = codrostros(images)
print("Tiempo de ejecucion: ", time.time() - start_time_stamp, "segundos. ",len(resources['resources']) , " imagenes cargadas. " )

def classifyFace(image):
    # Convert to NumPy array
    npimg = np.fromfile(image, np.uint8)
    # Decode image
    encodeTheImage = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)
    resizedImage = cv2.resize(encodeTheImage, (0, 0), None, 0.25, 0.25)
    # Convert to RGB
    rgb = cv2.cvtColor(resizedImage, cv2.COLOR_BGR2RGB)

    face = fr.face_locations(rgb)
    faceCod = fr.face_encodings(rgb, face)
    faceCod = np.array(faceCod)

    for cod in rostroscod:
        # Detectamos los rostros
        comparacion = fr.compare_faces([cod], faceCod)
        print(comparacion)
        if comparacion[0] == True:
            return classNames[rostroscod.index(cod)].split('/')[1]
    return 'Desconocido'

