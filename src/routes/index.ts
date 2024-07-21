import { Router } from "express";
import getCoordinates from "./getCoordinates";
import { helloWorldController } from "../controllers/helloWorldController";

const router = Router();

//subruta "/"
router.get("/", helloWorldController);

//subruta "/coordinates"
router.use("/coordinates", getCoordinates);
export default router;
