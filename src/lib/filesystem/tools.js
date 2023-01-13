import fs from "fs-extra";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { readJSON, writeJSON, writeFile, unlink } = fs;

const mediasJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/medias.json"
);

const publicFolderImgPath = join(process.cwd(), "./public/img/medias");

export const getMedias = async () => readJSON(mediasJSONPath);

export const writeMedias = (mediasArray) =>
  writeJSON(mediasJSONPath, mediasArray);

export const cloadinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "epicode/netflixMedias",
    },
  }),
}).single("poster");
