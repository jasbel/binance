import { Request, Response } from "express";
import { capturePrice, Price } from "../cron";

export const getCapture = async (_: Request, res: Response) => {
  const { origin = "" } = _.query;

  const date = new Date();
  const currentInfo = await capturePrice(<string>origin);
  res.json({ ok: "generate", price: currentInfo, origin: origin, date });
};

export const getPrices = async (_: Request, res: Response) => {
  const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 10 });
  res.json(prices);
};
export const getGrafic = async (_: Request, res: Response) => {
  const { items = "100" } = _.query;

  const formatFecha = (fechaStr: string) => {
    const dias = ["D", "L", "M", "X", "J", "V", "S"]; // Domingo a Sábado
    const fecha = new Date(fechaStr);

    const formatter = new Intl.DateTimeFormat("es-BO", {
      timeZone: "America/La_Paz",
      weekday: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(fecha);
    const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

    // Extraer los datos que te interesan
    let diaSemana = map.weekday.includes("mié") ? "Mi" : map.weekday.charAt(0).toUpperCase();
    const diaMes = map.day;
    const horas = map.hour;
    const minutos = map.minute;

    return `${diaSemana} (${diaMes}) ${horas}:${minutos}`;
  };

  const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: Number(items) });

  const pricesArr = prices.map((it) => it.dataValues).map((it) => ({ ...it, createdAt: formatFecha(it.createdAt) }));

  res.render("grafico", { data: JSON.stringify(pricesArr), items: Number(items) });
};
