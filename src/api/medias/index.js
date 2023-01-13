import express from "express";
import { checksMediaSchema, triggerBadRequest } from "./validator.js";
import {
  findMediaById,
  findMediaBySearch,
  getPDFreadableStream,
  saveNewMedia,
  saveNewMediaFromOmdb,
} from "../../lib/db/mediasTools.js";
import {
  cloadinaryUploader,
  getMedias,
  writeMedias,
} from "../../lib/filesystem/tools.js";
import createHttpError from "http-errors";
import { pipeline } from "stream";

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

// *********GET ALL MEDIA LIST || BY SEARCH VALUE*********

mediasRouter.get("/", async (req, res, next) => {
  if (req.query.search) {
    console.log(req.query.search);
    try {
      const mediasArray = await findMediaBySearch(req.query.search);
      console.log("🚀 mediasArray", mediasArray);

      if (mediasArray.length > 0) {
        res.send(mediasArray);
      } else {
        try {
          let responseOmdb = await fetch(
            `${process.env.FETCH_URL}${req.query.search.toLowerCase()}`,
            { method: "GET" }
          );
          if (responseOmdb.ok) {
            let data = await responseOmdb.json();

            let movies = data.Search;

            await saveNewMediaFromOmdb(movies);

            res.send(movies);
          } else {
            next(NotFound(`No media with search ${req.query.search} found!`));
          }
        } catch (error) {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const medias = await getMedias();

      res.send(medias);
    } catch (error) {
      next(error);
    }
  }
});

// *********GET SINGLE MEDIA BY ID*********

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

// // *********GET SINGLE MEDIA BY TITLE*********

// mediasRouter.get("/", async (req, res, next) => {
//   console.log(req.query.title);
//   try {
//     const mediasArray = await findMediaByTitle(req.query.title);

//     if (mediasArray.length > 0) {
//       res.send(mediasArray);
//     } else {
//       //   console.log(NotFound(`Media with imdbID ${req.params.id} not found!`));
//       next(NotFound(`Media with title ${req.params.title} not found!`));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

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

// *********GET SINGLE MEDIA AS PDF*********

mediasRouter.get("/:id/pdf", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.id);

    if (media) {
      res.setHeader(
        "Content-Disposition",
        `attachmet; filename=${media.imdbID}.pdf`
      );

      const source = getPDFreadableStream(media);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    } else {
      next(NotFound(`Media with imdbID ${req.params.imdbID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
