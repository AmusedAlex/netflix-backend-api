import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mediasRouter from "./api/medias/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";

const server = express();
const port = 1337;

server.use(cors());
server.use(express.json());

// *****************ENDPOINTS****************

server.use("/medias", mediasRouter);

// **************ERROR HANDLERS**************

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

// ****************MIDDLEWARES***************

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server running on port:", port);
});
