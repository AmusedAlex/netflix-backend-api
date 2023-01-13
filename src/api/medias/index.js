import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksMediaSchema, triggerBadRequest } from "./validator.js";
import { saveNewMedia } from "../../lib/db/mediasTools.js";

const mediasRouter = express.Router();

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
  } catch (error) {
    next(error);
  }
});

// *********GET SINGLE MEDIA*********

mediasRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// *********POST COVER TO SINGLE MEDIA*********

mediasRouter.post("/:id/poster", async (req, res, next) => {
  try {
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
