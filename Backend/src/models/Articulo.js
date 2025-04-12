const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Articulo = sequelize.define('Articulo', {
    IDArticulo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ArticuloNombre: { type: DataTypes.STRING(100), allowNull: false },
    ArticuloLaboratorio: { type: DataTypes.STRING, allowNull: false },
    ArticuloSaldo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    ArticuloCostos: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    ArticuloPrecioVenta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

}, {
    timestamps: false

});

module.exports = { Articulo };