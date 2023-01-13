import express from "express";
import { checksMediaSchema, triggerBadRequest } from "./validator.js";
import { findMediaById, saveNewMedia } from "../../lib/db/mediasTools.js";
import {
  cloadinaryUploader,
  getMedias,
  writeMedias,
} from "../../lib/filesystem/tools.js";
import createHttpError from "http-errors";

const mediasRouter = express.Router();
const { NotFound } = createHttpError;

// *********POST MEDIA*********

mediasRouter.post(
  "/",
  checksMediaSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const imdbID = await saveNewMedia(req.body);
      res.status(201).send({ imdbID });
    } catch (error) {
      next(error);
    }
  }
);

// *********GET MEDIA LIST*********

mediasRouter.get("/", async (req, res, next) => {
  try {
    const medias = await getMedias();

    res.send(medias);
  } catch (error) {
    next(error);
  }
});

// *********GET SINGLE MEDIA*********

mediasRouter.get("/:id", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.id);

    if (media) {
      res.send(media);
    } else {
      //   console.log(NotFound(`Media with imdbID ${req.params.id} not found!`));
      next(NotFound(`Media with imdbID ${req.params.imdbID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// *********POST COVER TO SINGLE MEDIA*********

mediasRouter.post("/:id/poster", cloadinaryUploader, async (req, res, next) => {
  try {
    console.log(req.file);
    const url = req.file.path;
    const medias = await getMedias();
    const index = medias.findIndex((media) => media.imdbID === req.params.id);

    if (index !== -1) {
      const oldMedia = medias[index];
      const updatedMedia = { ...oldMedia, poster: url, updatedAt: new Date() };

      medias[index] = updatedMedia;
      await writeMedias(medias);

      res.send(medias[index]);
    } else {
      next(NotFound(`Media with imdbID ${req.params.imdbID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// *********GET MEDIA AS PDF*********

mediasRouter.get("/:id/pdf", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
