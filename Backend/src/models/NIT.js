const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const NIT = sequelize.define('Nit',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    NITNombre:{type: DataTypes.STRING(100), allowNull:false},
    NITDocumento:{type: DataTypes.STRING(20), allowNull:false, unique:true},
    NITCupo:{type: DataTypes.DOUBLE(10,2), allowNull:false},
    NITPlazo:{type: DataTypes.INTEGER, allowNull:false},
},{ 
    timestamps:false

});

module.exports = NIT;