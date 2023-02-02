import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { pgConnect, syncModels } from "./db.js";
import productRouter from "../src/api/products/index.js";
import userRouter from "../src/api/users/index.js";
import categoryRouter from "../src/api/categories/index.js";
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

// ********************************* MIDDLEWARES ***************************************
server.use(cors());
server.use(express.json());

// ********************************** ENDPOINTS ****************************************
server.use("/products", productRouter);
server.use("/categories", categoryRouter);
server.use("/users", userRouter);

// ******************************* ERROR HANDLERS **************************************
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericErrorHandler);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
