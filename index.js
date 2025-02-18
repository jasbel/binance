const axios = require('axios');
const crypto = require('crypto');

// Tus claves de API
const API_KEY = '';
const SECRET_KEY = '';

// URL base de la API de Binance
const BASE_URL = 'https://api.binance.com';

// Función para firmar la solicitud
function signRequest(queryString, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(queryString)
        .digest('hex');
}

// Función para obtener los precios de los activos en tu cartera
async function getPortfolioPrices() {
    try {
        // Obtener la información de la cuenta (incluyendo los balances)
        const endpoint = '/api/v3/account';
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = signRequest(queryString, SECRET_KEY);

        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
                'X-MBX-APIKEY': API_KEY,
            },
            params: {
                timestamp,
                signature,
            },
        });

        const balances = response.data.balances;

        // Filtrar los activos con saldo mayor a 0
        const nonZeroBalances = balances.filter((asset) => parseFloat(asset.free) > 0);

        // Obtener los precios actuales de los activos
        const symbols = nonZeroBalances.map((asset) => `${asset.asset}`);
        const prices = {};

        for (const assetSymbol of symbols) {
          const _symbol = (assetSymbol.startsWith('LD') ? assetSymbol.slice(2) : assetSymbol)

          if(_symbol !== 'USDT' && _symbol !=='SHIB2') {
            const symbol = `${_symbol}USDT`;
            const tickerResponse = await axios.get(`${BASE_URL}/api/v3/ticker/price`, {
                params: { symbol: `${symbol}`},
            }).catch(e => console.error(e));
            prices[assetSymbol] = tickerResponse?.data.price;
          }
        }

        // Mostrar los resultados
        console.log('Precios de tu cartera:');
        nonZeroBalances.forEach((asset) => {
            const symbol = `${asset.asset}`;
            const price = prices[symbol] || 'No disponible';
            console.log(`${asset.asset}: ${asset.free} (Precio: ${price} ${symbol})`);
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Ejecutar la función
getPortfolioPrices();