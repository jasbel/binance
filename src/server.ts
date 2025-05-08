import sequelize from "./database/db";
import app from "./app";

const PORT = process.env.PORT || 3000;

sequelize.sync(/* { alter: true } */).then((res) => {
    console.log("📦 Base de datos lista "
    );
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
});
