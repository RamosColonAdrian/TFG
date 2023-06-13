//Archivo de configuración para el procesado de imagenes
import Multer from "multer";

const multer = Multer({
  storage: Multer.memoryStorage(),
});

export default multer;
