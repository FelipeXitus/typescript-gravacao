import express from "express";
import "express-async-errors";
import router from "./routes";
import "reflect-metadata";
import { AppDataSource } from "./config/dataSource";
import { erroMiddleware } from "./middleware/erro";

const app = express();
app.use(express.json());
router(app);
app.use(erroMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado");
  })
  .catch((erro) => {
    console.log(erro);
  });

export default app;