import axios from "axios";

const BINANCE_P2P_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

export const getBestSellPrice = async () => {
  try {
    const response = await axios.post(BINANCE_P2P_URL, {
      asset: "USDT",
      tradeType: "SELL",
      fiat: "BOB",
      page: 1,
      rows: 1,
    });

    const ads = response.data?.data || [];
    if (ads.length === 0) return null;

    return ads[0].adv.price;
  } catch (error) {
    console.error("Error obteniendo precios:", error);
    return null;
  }
};
