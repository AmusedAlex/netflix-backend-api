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
const port = process.env.PORT;

// *******************CORS******************

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, `Origin ${origin} is not whitelisted!`));
    }
  },
};

server.use(express.json());
server.use(cors(corsOpts));

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
