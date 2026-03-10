import express, { RequestHandler } from "express";
import PetController from "../controller/PetController";
import PetRepository from "../repositories/PetRepository";
import { AppDataSource } from "../config/dataSource";
import { middlewareValidaBodyPet } from "../middleware/validadores/petRequestBody";
import { verificaIdMiddleware } from "../middleware/verificaId";

const router = express.Router();
const petRepository = new PetRepository(
  AppDataSource.getRepository("PetEntity"),
  AppDataSource.getRepository("AdotanteEntity")
);
const petController = new PetController(petRepository);
const validateBodyPet:RequestHandler = (req, res, next) => middlewareValidaBodyPet(req, res, next);

router
  .post("/", validateBodyPet, (req, res) => petController.criaPet(req, res))
  .get("/", (req, res) => petController.listaPet(req, res))
  .put("/:id", verificaIdMiddleware, (req, res) => petController.atualizaPet(req, res))
  .delete("/:id", verificaIdMiddleware, (req, res) => petController.deletaPet(req, res))
  .put("/:pet_id/:adotante_id", verificaIdMiddleware, (req, res) => petController.adotaPet(req, res))
  .get("/filtro", (req, res) => petController.buscaPetPorCampoGenerico(req, res));

export default router;