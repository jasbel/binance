import { Router } from "express";
import { getCapture, getGrafic, getPrices } from "../controllers/data.controller";

const dataRoutes = Router()

dataRoutes.get("/prices", getPrices);
dataRoutes.get("/capture", getCapture);

dataRoutes.get('/grafico', getGrafic);

export default dataRoutes