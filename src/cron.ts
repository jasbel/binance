import { getBestSellPrice } from "./binance";
import sequelize from "./database/db";
import { DataTypes } from "sequelize";

const Price = sequelize.define("Price", {
  price: { type: DataTypes.FLOAT, allowNull: false },
});

const capturePrice = async () => {
  const price = await getBestSellPrice();
  if (price) {
    await Price.create({ price });
    console.log(`✅ Precio guardado: ${price}`);
  }

  return price
};

export { capturePrice, Price };
