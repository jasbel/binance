import express from 'express'
import dataRoutes from './routes/data.routes'

const app = express()

app.use(express.json())

app.use(express.static('public'));

app.use('/', dataRoutes)

app.set('view engine', 'ejs'); // o pug si prefieres

export default app;
