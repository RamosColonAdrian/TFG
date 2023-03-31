# Imagen base
FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && \
    apt-get install -y build-essential cmake
    
ENV CMAKE_GENERATOR="Ninja"
RUN pip install dlib
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]



