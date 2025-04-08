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
    const fecha = new Date(fechaStr)

    const formatter = new Intl.DateTimeFormat("es-BO", {
      timeZone: "America/La_Paz",
      weekday: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(fecha);
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

  // Extraer los datos que te interesan
  const diaSemana = map.weekday.charAt(0).toUpperCase(); // ej. 'L' para lunes
  const diaMes = map.day;
  const horas = map.hour;
  const minutos = map.minute;

  return `${diaSemana} (${diaMes}) ${horas}:${minutos}`;
  };

  const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 100 });

  const pricesArr = prices.map((it) => it.dataValues).map(it=> ({...it, createdAt: formatFecha(it.createdAt)}));

  res.render("grafico", { data: JSON.stringify(pricesArr) });
};
