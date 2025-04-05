import { Request, Response } from "express";
import { capturePrice, Price } from "../cron";

export const getCapture = async (_: Request, res: Response) => {
    const currentInfo = await capturePrice()
    res.json({ ok: 'generate', data: currentInfo });
}

export const getPrices = async (_: Request, res: Response) => {
    const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 10 });
    res.json(prices);
}