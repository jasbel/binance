import { Router } from "express";
import { getCapture, getPrices } from "../controllers/data.controller";

const dataRoutes = Router()

dataRoutes.get("/prices", getPrices);
dataRoutes.get("/capture", getCapture);

export default dataRoutes