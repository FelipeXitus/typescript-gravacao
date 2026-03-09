import express, { RequestHandler } from "express";
import { AppDataSource } from "../config/dataSource";
import AdotanteController from "../controller/AdotanteController";
import AdotanteRepository from "../repositories/AdotanteRepository";
import middlewareValidadorBodyAdotante from "../middleware/validadores/adotanteRequestBody";
import middlewareValidadorBodyEndereco from "../middleware/validadores/enderecoRequestBody";

const router = express.Router();
const adotanteRepository = new AdotanteRepository(
  AppDataSource.getRepository("AdotanteEntity")
);
const adotanteController = new AdotanteController(adotanteRepository);
const validateBodyAdotante:RequestHandler = (req, res, next) => middlewareValidadorBodyAdotante(req, res, next);
const validateEnderecoBody:RequestHandler = (req, res, next) => middlewareValidadorBodyEndereco(req, res, next);

router
  .post("/", validateBodyAdotante, (req, res) => adotanteController.criaAdotante(req, res))
  .get("/", (req, res) => adotanteController.listaAdotantes(req, res))
  .put("/:id", (req, res) => adotanteController.atualizaAdotante(req, res))
  .delete("/:id", (req, res) => adotanteController.deletaAdotante(req, res))
  .patch("/:id", validateEnderecoBody, (req, res) => adotanteController.atualizaEnderecoAdotante(req, res));

export default router;
