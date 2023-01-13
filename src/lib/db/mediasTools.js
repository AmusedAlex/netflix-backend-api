import uniqid from "uniqid";
import { getMedias, writeMedias } from "../filesystem/tools.js";
import { createReadStream } from "fs";
import PdfPrinter from "pdfmake";

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

export const findMediaById = async (reqImdbID) => {
  console.log("searching by ID");
  const medias = await getMedias();

  const media = medias.find((media) => media.imdbID === reqImdbID);

  return media;
};

export const findMediaBySearch = async (requestedSearch) => {
  console.log("searching by search value");
  const medias = await getMedias();

  const mediasArray = await medias.filter((media) => {
    return media.title.toLowerCase().includes(requestedSearch.toLowerCase());
  });

  return mediasArray;
};

export const getPDFreadableStream = (media) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: `Title: ${media.title}`, style: "header" },
      { text: `Type: ${media.type}` },
      { text: `Year: ${media.year}` },
    ],
    styles: {
      header: {
        fontSize: 48,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
