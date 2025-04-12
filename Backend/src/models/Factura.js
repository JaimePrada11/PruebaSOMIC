const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { NIT } = require('./NIT');


const Factura = sequelize.define('Factura', {
    IDFactura: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    IDNIT: { type: DataTypes.INTEGER, allowNull: false },
    Facturafecha: { type: DataTypes.DATE, allowNull: false },
    FacturafechaVencimiento: { type: DataTypes.DATE, allowNull: false },
    FacturatotalCostos: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    FacturatotalVenta: { type: DataTypes.DECIMAL(10, 2), allowNull: false }

}, {
    tableName: 'Facturas',
    timestamps: false
});

Factura.belongsTo(NIT, { foreignKey: 'IDNIT', as: 'FacturaNIT' });

module.exports = { Factura };
