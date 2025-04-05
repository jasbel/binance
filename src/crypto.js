const ccxt = require('ccxt'); 
const { RSI, SMA } = require('technicalindicators');

// Configuración
const exchange = new ccxt.binance(); // Puedes cambiar a otro exchange soportado
const symbol = 'BTC/USDT'; // Par de trading
const timeframe = '1h'; // Temporalidad de las velas
const lookbackPeriod = 50; // Período para calcular máximos/mínimos
const rsiLength = 14; // Período del RSI
const rsiOverbought = 70;
const rsiOversold = 30;
const volumeMultiplier = 1.5;
const zoneWidthPercent = 1.5 / 100; // 1.5%

// Obtener datos de mercado
async function fetchMarketData() {
    try {
        console.log(`---${symbol}---`)
        const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, lookbackPeriod);
        
        // Extraer datos de OHLCV
        const closes = ohlcv.map(candle => candle[4]); // Cierre
        const volumes = ohlcv.map(candle => candle[5]); // Volumen
        const highs = ohlcv.map(candle => candle[2]); // Máximos
        const lows = ohlcv.map(candle => candle[3]); // Mínimos

        // Calcular RSI
        const rsiValues = RSI.calculate({ period: rsiLength, values: closes });
        const lastRSI = rsiValues[rsiValues.length - 1];

        // Calcular SMA del volumen
        const volSMA = SMA.calculate({ period: lookbackPeriod, values: volumes });
        const lastVolSMA = volSMA[volSMA.length - 1];
        const lastVolume = volumes[volumes.length - 1];

        // Detectar sobrecompra/sobreventa con volumen alto
        const highVolume = lastVolume > (lastVolSMA * volumeMultiplier);
        const isOverbought = lastRSI >= rsiOverbought && highVolume;
        const isOversold = lastRSI <= rsiOversold && highVolume;

        // Calcular máximos y mínimos recientes
        const recentHigh = Math.max(...highs);
        const recentLow = Math.min(...lows);

        // Calcular zonas de compra/venta
        const buyZoneTop = recentLow * (1 + zoneWidthPercent);
        const buyZoneBottom = recentLow * (1 - zoneWidthPercent);
        const sellZoneTop = recentHigh * (1 + zoneWidthPercent);
        const sellZoneBottom = recentHigh * (1 - zoneWidthPercent);

        const ticker = await exchange.fetchTicker(symbol);

        // Mostrar resultados
        console.log(`📊 Último RSI: ${lastRSI}`);
        console.log(`📈 Último volumen: ${lastVolume} (SMA: ${lastVolSMA})`);
        console.log(`🟢 Condición de Compra: ${isOversold ? 'Sí ✅' : 'No ❌'}`);
        console.log(`🔴 Condición de Venta: ${isOverbought ? 'Sí ✅' : 'No ❌'}`);
        console.log(`📉 Zona de Compra: ${buyZoneBottom.toFixed(2)} - ${buyZoneTop.toFixed(2)}`);
        console.log(`📈 Zona de Venta: ${sellZoneBottom.toFixed(2)} - ${sellZoneTop.toFixed(2)}`);
        console.log(`🟠 Soporte: ${recentLow.toFixed(2)}`);
        console.log(`🔵 Resistencia: ${recentHigh.toFixed(2)}`);
        console.log(`🔵 Actual: ${ticker.last}`);

        // ALERTAS (puedes conectar esto a Telegram, Discord o notificaciones)
        if (isOversold) console.log("🚨 ALERTA: Señal de COMPRA detectada!");
        if (isOverbought) console.log("🚨 ALERTA: Señal de VENTA detectada!");
    } catch (error) {
        console.error("❌ Error obteniendo datos:", error);
    }
}

// Ejecutar la función
fetchMarketData();
