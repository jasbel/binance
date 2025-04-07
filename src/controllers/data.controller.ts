import { Request, Response } from "express";
import { capturePrice, Price } from "../cron";

export const getCapture = async (_: Request, res: Response) => {
  const currentInfo = await capturePrice();
  res.json({ ok: "generate", data: currentInfo });
};

export const getPrices = async (_: Request, res: Response) => {
  const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 10 });
  res.json(prices);
};
export const getGrafic = async (_: Request, res: Response) => {
  const formatFecha = (fechaStr: string) => {
    const dias = ["D", "L", "M", "X", "J", "V", "S"]; // Domingo a Sábado
    const fecha = new Date(fechaStr);
    // rawData.map(item => new Date(item.createdAt).toLocaleString());

    const diaSemana = dias[fecha.getDay()];
    const diaMes = fecha.getDate();
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");

    return `${diaSemana} (${diaMes}) ${horas}:${minutos}`;
  };

  const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 100 });

  const pricesArr = prices.map((it) => it.dataValues).map(it=> ({...it, createdAt: formatFecha(it.createdAt)}));

  res.render("grafico", { data: JSON.stringify(pricesArr) });
};
