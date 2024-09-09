import { Router } from "express";
import getCoordinates from "./getCoordinates";
import scrapSupermercados from "./scrapSupermercadosRosario";
const router = Router();

//subruta "/"
// router.get("/", helloWorldController);

//subruta "/coordinates"
router.use("/coordinates", getCoordinates);
//subruta "/scrapSupermercadosRosario"
router.use("/scrapSupermercadosRosario", scrapSupermercados);
export default router;
