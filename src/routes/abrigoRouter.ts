import express, { RequestHandler } from "express";
import { AppDataSource } from "../config/dataSource";
import AbrigoController from "../controller/AbrigoController";
import AbrigoRepository from "../repositories/AbrigoRepository";
import { middlewareValidadorBodyAbrigo } from "../middleware/validadores/abrigoRequestBody";
import { middlewareValidadorBodyEndereco } from "../middleware/validadores/enderecoRequestBody";
import { verificaIdMiddleware } from "../middleware/verificaId";

const router = express.Router();
const abrigoRepository = new AbrigoRepository(
  AppDataSource.getRepository("AbrigoEntity")
);
const abrigoController = new AbrigoController(abrigoRepository);
const validateBodyAbrigo:RequestHandler = (req, res, next) => middlewareValidadorBodyAbrigo(req, res, next);
const validateEnderecoBody:RequestHandler = (req, res, next) => middlewareValidadorBodyEndereco(req, res, next);

router
  .post("/", validateBodyAbrigo, (req, res) => abrigoController.criaAbrigo(req, res))
  .get("/", (req, res) => abrigoController.listaAbrigos(req, res))
  .put("/:id", verificaIdMiddleware, (req, res) => abrigoController.atualizaAbrigo(req, res))
  .delete("/:id", verificaIdMiddleware, (req, res) => abrigoController.deletaAbrigo(req, res))
  .patch("/:id", verificaIdMiddleware, validateEnderecoBody, (req, res) => abrigoController.atualizaEnderecoAbrigo(req, res));

export default router;
