import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const mediaSchema = {
  Title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a String.",
    },
  },
  Year: {
    in: ["body"],
    isString: {
      errorMessage: "Year is a mandatory field and needs to be a String.",
    },
  },
  Type: {
    in: ["body"],
    isString: {
      errorMessage: "Type is a mandatory field and needs to be a String.",
    },
  },
};

export const checksMediaSchema = checkSchema(mediaSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during media post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next(); // no errors
  }
};

// VALIDATION CHAIN 1. checksMediaSchema --> 2. triggerBadRequest
