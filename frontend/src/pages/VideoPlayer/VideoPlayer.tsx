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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      setSelectedDeviceId(videoDevices[0]?.deviceId || "");
    });
  }, []);

  const onCapture = () => {
    setIsCapturing((prev) => !prev);
  };

  useEffect(() => {
    let captureInterval: number | null = null;
    if (isCapturing) {
      captureInterval = setInterval(async () => {
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
            toast.success(`Welcome ${data.message}`);
            setIsCapturing(false);
          }
        } catch (error) {
          setIsCapturing(false);
          if ((error as AxiosError).response?.status === 401) {
            toast.warning("Not authorized");
          } else {
            toast.error("Unknown error");
          }
        }
      }, 500);
    } else {
      if (captureInterval) clearInterval(captureInterval);
    }

    // Cleanup function to clear the interval
    return () => {
      if (captureInterval) clearInterval(captureInterval);
    };
  }, [isCapturing]);

  useEffect(() => {
    let timeOut: number;

    if (!isCapturing) return;
    (async () => {
      await new Promise((res) => {
        timeOut = setTimeout(() => {
          setIsCapturing(false);
          toast.warning("User not recognized");
          res(1);
        }, 5000);
      });
    })();
    return () => {
      if (timeOut) clearTimeout(timeOut);
    };
  }, [isCapturing]);

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
        className={clxs(
          "fixed top-10 right-10 border font-medium p-3 rounded-full",
          isCapturing ? "bg-red-500 border-red-500 text-white" : "border-black"
        )}
        onClick={onCapture}
      >
        Capturar
      </button>
    </div>
  );
};

export default VideoPlayer;
