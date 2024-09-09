import { scrapSupermercadosController } from "../controllers/scrapSupermercadosController";
import { Router } from "express";
const router = Router();

//Endpoint para la subruta "/" dentro de /coordenadas (/coordenadas/)
router.post("/", scrapSupermercadosController);
export default router;
