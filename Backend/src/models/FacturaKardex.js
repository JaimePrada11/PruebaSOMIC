const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Factura } = require('./Factura');
const { Articulo } = require('./Articulo');


const FacturaKardex = sequelize.define('FacturaKardex', {
    IDFacturaKardex: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    IDFactura: { type: DataTypes.INTEGER, allowNull: false },
    IDArticulo: { type: DataTypes.INTEGER, allowNull: false },
    FacturaKardexCantidad: { type: DataTypes.INTEGER, allowNull: false},
    FacturaKardexnaturaleza: { type: DataTypes.STRING(1), allowNull: false },
}, {
    tableName: 'FacturaKardex',
    timestamps: false
});

FacturaKardex.belongsTo(Articulo, { foreignKey: 'IDArticulo' });
FacturaKardex.belongsTo(Factura, { foreignKey: 'IDFactura' });

module.exports = { FacturaKardex };
