import cv2
import numpy as np
import face_recognition as fr
import os
import cloudinary_config
import cloudinary
import cloudinary.api 
import requests
import time

decoded_images = []
image_names = []
encoded_faces = []
    
def loadImages():
    decoded_images.clear()
    image_names.clear()

    start_time_stamp =  time.time()

    cloudinary_resources = cloudinary.api.resources(type="upload", prefix="face_recognition", latest=True)
    cloudinary_images_data = []
    transformations = [
        {'width': 400, 'height': 400, 'gravity': 'face' },
        # Add more transformations as needed
    ]

    # Generate the transformation string
    transformationstr = "/".join(
        [f"{k}{v}" for k, v in transformations[0].items()])

    for resource in cloudinary_resources['resources']:
        url = resource['url']
        filename = resource['public_id']
        image_url = cloudinary.utils.cloudinary_url(url, transformation=transformationstr)[0]
        image_data = requests.get(image_url).content
        cloudinary_images_data.append([filename, image_data])

    for image_data in cloudinary_images_data:
        cv2_decoded_image = cv2.imdecode(np.frombuffer(image_data[1], np.uint8), cv2.IMREAD_UNCHANGED)
        decoded_images.append(cv2_decoded_image)
        image_names.append(os.path.splitext(image_data[0])[0])
    print("Tiempo de ejecucion: ", time.time() - start_time_stamp, "segundos. ",len(cloudinary_resources['resources']) , " imagenes cargadas. " )

def encodeFaces(images):
    encoded = []
    for img in images:
        cv2_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encoded_img = fr.face_encodings(cv2_img)[0]
        encoded.append(encoded_img)
    return encoded

def reloadModel():
    loadImages()
    global encoded_faces
    encoded_faces = encodeFaces(decoded_images)

def classifyFace(image): 
    numpy_img = np.frombuffer(image, np.uint8)
    encoded_img = cv2.imdecode(numpy_img, cv2.IMREAD_UNCHANGED)
    resized_img = cv2.resize(encoded_img, (0, 0), None, 0.25, 0.25)
    rgb_corrected_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB)

    face = fr.face_locations(rgb_corrected_img)
    face_encoded = fr.face_encodings(rgb_corrected_img, face)
    face_encoded_numpy_array = np.array(face_encoded)

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