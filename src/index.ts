import express from "express";
import { capturePrice, Price } from "./cron";
import sequelize from "./db";

const app = express();
app.use(express.json());

app.get("/prices", async (_, res) => {
    const prices = await Price.findAll({ order: [["createdAt", "DESC"]], limit: 10 });
    res.json(prices);
});


app.get("/capture", async (_, res) => {
    const currentInfo = await capturePrice()
    res.json({ ok: 'generate', data: currentInfo });
});



sequelize.sync().then(() => {
    console.log("📦 Base de datos lista");
    app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));
});
