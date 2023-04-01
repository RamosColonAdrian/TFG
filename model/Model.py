import cv2
import numpy as np
import face_recognition as fr
import os
import cloudinary_config
import cloudinary
import cloudinary.api 
import requests
import time


start_time_stamp =  time.time()

cloudinary_resources = cloudinary.api.resources(type="upload", prefix="face_recognition")

cloudinary_images_data = []

for resource in cloudinary_resources['resources']:
    url = resource['url']
    filename = resource['public_id']
    image_url = cloudinary.utils.cloudinary_url(url)[0]
    image_data = requests.get(image_url).content
    cloudinary_images_data.append([filename, image_data])

decoded_images = []
image_names = []

for image_data in cloudinary_images_data:
    cv2_decoded_image = cv2.imdecode(np.frombuffer(image_data[1], np.uint8), cv2.IMREAD_UNCHANGED)
    decoded_images.append(cv2_decoded_image)
    image_names.append(os.path.splitext(image_data[0])[0])
    

def encodeFaces(images):
    encoded = []
    for img in images:
        cv2_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encoded_img = fr.face_encodings(cv2_img)[0]
        encoded.append(encoded_img)
    return encoded

encoded_faces = encodeFaces(decoded_images)

print("Tiempo de ejecucion: ", time.time() - start_time_stamp, "segundos. ",len(cloudinary_resources['resources']) , " imagenes cargadas. " )

def classifyFace(image):
    numpy_img = np.fromfile(image, np.uint8)
    encoded_img = cv2.imdecode(numpy_img, cv2.IMREAD_UNCHANGED)
    resized_img = cv2.resize(encoded_img, (0, 0), None, 0.25, 0.25)
    rgb_corrected_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB)

    face = fr.face_locations(rgb_corrected_img)
    face_encoded = fr.face_encodings(rgb_corrected_img, face)
    face_encoded_numpy_array = np.array(face_encoded)

    for encoded_face in encoded_faces:
        comparison = fr.compare_faces([encoded_face], face_encoded_numpy_array)
        print(comparison)
        if comparison[0] == True:
            return image_names[encoded_faces.index(encoded_face)].split('/')[1]
    return 'Desconocido'

