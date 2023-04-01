# Imagen base
FROM ubuntu:latest

WORKDIR /app

COPY requirements.txt .

RUN apt-get update 

RUN apt-get install -y python3 pip cmake ffmpeg libsm6 libxext6
    
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



