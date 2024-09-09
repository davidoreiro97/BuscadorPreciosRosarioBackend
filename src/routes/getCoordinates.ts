import { getCoordinatesController } from "../controllers/getCoordinatesController";
import { Router } from "express";
const router = Router();

//Endpoint para la subruta "/" dentro de /coordenadas (/coordenadas/)
router.post("/", getCoordinatesController);
export default router;
