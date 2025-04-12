const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, sequelize } = require('./config/database');

const nitRutas = require('./Rutas/NITRutas.js');
const articuloRutas = require('./Rutas/ArticuloRutas');
const facturaRutas = require ('./Rutas/FacturaRutas.js');
const kardexRutas = require ('./Rutas/KardexRutas.js');

const app = express();

app.use(bodyParser.json());

app.use('/api/nit', nitRutas);
app.use('/api/articulos', articuloRutas);
app.use('/api/factura', facturaRutas)
app.use('/kardex', kardexRutas)


sequelize.sync({ alter: true }).then(() => {
    const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
}).catch(
    (err) => {
        console.error('Error al conectar a la base de datos:', err);
        }
)

