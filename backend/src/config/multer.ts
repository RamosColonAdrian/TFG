import Multer from "multer";

const multer = Multer({
  storage: Multer.memoryStorage(),
});

export default multer;
