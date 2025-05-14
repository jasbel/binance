import { Router } from "express";
import { addPrice, getCapture, getGrafic, getPrices } from "../controllers/data.controller";

const dataRoutes = Router()

dataRoutes.get("/prices", getPrices);
dataRoutes.get("/capture", getCapture);
dataRoutes.get("/create-price", addPrice);

dataRoutes.get('/grafico', getGrafic);

export default dataRoutes