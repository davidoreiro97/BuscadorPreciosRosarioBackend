import {
	getCoordinatesController,
	testController,
} from "../controllers/getCoordinatesController";
import { Router } from "express";
const router = Router();

//Endpoint para la subruta "/" dentro de /coordenadas (/coordenadas/)
router.get("/", getCoordinatesController);

//Endpoint para la subruta "/test" dentro de /coordenadas (/coordenadas/test)
router.get("/test", testController);
export default router;
