import axios, { AxiosError } from "axios";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import dataURLtoFile from "../../helpers/dataURLtoFile";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import clxs from "../../helpers/clxs";
import { HiOutlineVideoCamera } from "react-icons/hi";

const VideoPlayer = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState<Boolean>(false);
  const { zoneId } = useParams();
  const captureDelay = 500; // 5 segundos

  // Obtiene los dispositivos de video disponibles
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      setSelectedDeviceId(videoDevices[0]?.deviceId || "");
    });
  }, []);

  // Funcion que se ejecuta cuando se hace click en el boton de capturar 
  const onCapture = () => {
    setIsCapturing((prev) => !prev);
  };

  // Efecto que se ejecuta cuando se cambia el estado de captura de video
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let captureAttempts = 0; // Contador de intentos fallidos
    const maxCaptureAttempts = 10; // Número máximo de intentos fallidos antes de detener la captura

    if (isCapturing) {
      // Función que realiza la llamada al endpoint
      const captureFrame = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        const imageFile = dataURLtoFile(imageSrc, "image.png");
        const formData = new FormData();
        formData.append("img", imageFile);
        formData.append("zoneId", zoneId as string);

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/recognizer`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (data.message !== "Desconocido") {
            setIsCapturing(false);
            toast.success(`Welcome ${data.message}`);
            clearTimeout(timeout!); // Cancelar el temporizador si se reconoce a alguien
          } else {
            captureAttempts++; // Incrementar el contador de intentos fallidos
            if (captureAttempts >= maxCaptureAttempts) {
              setIsCapturing(false);
              toast.warning("Unknown User");
              clearTimeout(timeout!); // Cancelar el temporizador si se alcanza el número máximo de intentos fallidos
            } else {
              // Continuar la captura después de un breve retardo
              timeout = setTimeout(captureFrame, captureDelay);
            }
          }
        } catch (error) {
          setIsCapturing(false);
          if ((error as AxiosError).response?.status === 401) {
            toast.warning("Not authorized");
          } else {
            toast.error("Unknown error");
          }
        }
      };

      // Iniciar la captura después del tiempo de retardo
      timeout = setTimeout(captureFrame, captureDelay);
    } else {
      // Cancelar el temporizador si se detiene la captura
      clearTimeout(timeout!);
    }

    // Cleanup function que se ejecuta cuando se desmonta el componente
    return () => {
      clearTimeout(timeout!); // Cancelar el temporizador si se desmonta el componente
    };
  }, [isCapturing]);

  // Funcion que se ejecuta cuando se cambia el dispositivo de video
  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col bg-white bg-opacity-90">
      <div className="fixed top-10 left-10 z-10 flex items-center gap-2 group h-8">
        <label className="" htmlFor="camera-dropdown">
          <HiOutlineVideoCamera size={"2em"} />
        </label>
        <select
          className="hidden group-hover:block border border-black rounded-md p-1"
          id="camera-dropdown"
          value={selectedDeviceId}
          onChange={handleDeviceChange}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Cámara ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <Webcam
        className="w-full h-full"
        audio={false}
        ref={webcamRef}
        videoConstraints={{
          deviceId: selectedDeviceId,
          width: 720,
          height: 576,
        }}
      />
      <button
        className={clxs("flex justify-center items-center gap-3 fixed top-10 right-10 border-2 font-medium p-4 rounded-full",
          isCapturing
            ? "bg-red-200 text-red-600 border-red-500"
            : "bg-gray-200 border-gray-400 text-gray-600 font-medium"
        )}
        onClick={onCapture}
      >
        {isCapturing
          ? <div className="flex justify-center items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <p>Recording...</p>
          </div>
          : <div className="flex justify-center items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <p>Record</p>
          </div>
        }
      </button>
    </div>
  );
};

export default VideoPlayer;
