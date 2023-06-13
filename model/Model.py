import cv2
import numpy as np
import face_recognition as fr
import os
import cloudinary_config
import cloudinary
import cloudinary.api 
import requests
import time

# Lista para almacenar las imagenes decodificadas
decoded_images = []
# Lista para almacenar los nombres de las imagenes
image_names = []
# Lista para almacenar las caras codificadas (vectores de características) de las imágenes.
encoded_faces = []

# Esta función carga las imágenes desde Cloudinary y las decodifica utilizando OpenCV.
def loadImages():
    # Limpiar las listas de imagenes y nombres
    decoded_images.clear()
    image_names.clear()

    start_time_stamp =  time.time()

    # Obtener las imagenes de cloudinary
    cloudinary_resources = cloudinary.api.resources(type="upload", prefix="face_recognition", latest=True)
    cloudinary_images_data = []
    transformations = [
        {'width': 400, 'height': 400, 'gravity': 'face' },
    ]

    # Generar la cadena de transformaciones para obtener las imagenes de 400x400 con el rostro centrado en la imagen de  cloudinary
    transformationstr = "/".join(
        [f"{k}{v}" for k, v in transformations[0].items()])


    # Recorre las imagenes de cloudinary y las decodifica con OpenCV
    for resource in cloudinary_resources['resources']:
        # Obtener la url de la imagen
        url = resource['url']
        # Obtener el nombre de la imagen
        filename = resource['public_id']
        # Genera la url de la imagen con las transformaciones de 400x400 y el rostro centrado
        image_url = cloudinary.utils.cloudinary_url(url, transformation=transformationstr)[0]
        # Obtiene los datos de la imagen
        image_data = requests.get(image_url).content
        # Almacena los datos de la imagen en la lista de imagenes
        cloudinary_images_data.append([filename, image_data])

    # Decodifica las imagenes con OpenCV
    for image_data in cloudinary_images_data:
        # Decodifica la imagen con OpenCV y la almacena en la lista de imagenes decodificadas
        cv2_decoded_image = cv2.imdecode(np.frombuffer(image_data[1], np.uint8), cv2.IMREAD_UNCHANGED)
        decoded_images.append(cv2_decoded_image)
        image_names.append(os.path.splitext(image_data[0])[0])
    print("Tiempo de ejecucion: ", time.time() - start_time_stamp, "segundos. ",len(cloudinary_resources['resources']) , " imagenes cargadas. " )

# Esta función recibe una lista de imágenes y devuelve una lista de caras codificadas correspondientes a esas imágenes.
def encodeFaces(images):
    encoded = []
    #Recorre las imagenes y las codifica
    for img in images:
        # Convierte la imagen de BGR a RGB  (OpenCV utiliza BGR y face_recognition utiliza RGB)
        cv2_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Codifica la imagen y la almacena en la lista de imagenes codificadas
        encoded_img = fr.face_encodings(cv2_img)[0]
        encoded.append(encoded_img)
    return encoded

# Esta función recarga el modelo de reconocimiento de rostros con las imagenes de cloudinary
def reloadModel():
    loadImages()
    global encoded_faces
    encoded_faces = encodeFaces(decoded_images)

# Esta función clasifica una cara en una imagen dada comparándola con las caras codificadas almacenadas en encoded_faces.
def classifyFace(image): 
    #Convierte los datos de la imagen en un array de numpy 
    numpy_img = np.frombuffer(image, np.uint8)
    # Decodifica la imagen con OpenCV y la almacena en la lista de imagenes decodificadas
    encoded_img = cv2.imdecode(numpy_img, cv2.IMREAD_UNCHANGED)
    #Redimensiona la imagen a 1/4 de su tamaño original para acelerar el proceso de codificación
    resized_img = cv2.resize(encoded_img, (0, 0), None, 0.25, 0.25)
    # Convierte la imagen de BGR a RGB  (OpenCV utiliza BGR y face_recognition utiliza RGB)
    rgb_corrected_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB)

    # Localiza los rostros en la imagen y los codifica 
    face = fr.face_locations(rgb_corrected_img)
    face_encoded = fr.face_encodings(rgb_corrected_img, face)
    # Convierte el array de numpy en un array de numpy de 128 elementos
    face_encoded_numpy_array = np.array(face_encoded)

    # Itera Itera sobre las caras codificadas almacenadas en encoded_faces y realiza las siguientes acciones:
    # 1. Compara la cara codificada actual con las caras codificadas de la imagen utilizando fr.compare_faces().
    # 2. Si hay una coincidencia, devuelve el nombre de la imagen correspondiente a esa cara.
    # 3. Si no hay coincidencia, devuelve 'Desconocido'.
    for i in range(len(encoded_faces)):
            encoded_face = encoded_faces[i]
            try:
                comparison = fr.compare_faces([encoded_face], face_encoded_numpy_array)
                if comparison[0] == True:
                    return image_names[i].split('/')[1]
            except Exception as e:
                print(e)
    return 'Desconocido'

reloadModel()