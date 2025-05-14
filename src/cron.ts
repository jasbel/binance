import { getBestSellPrice } from "./binance";
import sequelize from "./database/db";
import { DataTypes } from "sequelize";

const Price = sequelize.define("Price", {
  price: { type: DataTypes.FLOAT, allowNull: false },
  origin: { type: DataTypes.STRING },
});

const capturePrice = async (origin: string) => {
  const price = await getBestSellPrice();
  if (price) {
    await createPrice(price, origin);
  }

  return price;
};

const createPrice = async (price: number, origin: string) => {
  await Price.create({ price, origin });
  console.log(`✅ Precio guardado: ${price}`);

  return price;
};

export { capturePrice, createPrice, Price };
