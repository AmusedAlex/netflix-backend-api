import uniqid from "uniqid";
import { getMedias, writeMedias } from "../filesystem/tools.js";

export const saveNewMedia = async (newMediaData) => {
  const medias = await getMedias();

  const newMedia = {
    ...newMediaData,
    createdAt: new Date(),
    updatedAt: new Date(),
    imdbID: uniqid(),
  };

  medias.push(newMedia);

  await writeMedias(medias);

  return newMedia.imdbID;
};
