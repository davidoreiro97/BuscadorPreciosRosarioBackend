import { Router } from "express";
import getCoordinates from "./getCoordinates";

const router = Router();

//subruta "/"
// router.get("/", helloWorldController);

//subruta "/coordinates"
router.use("/coordinates", getCoordinates);
export default router;
