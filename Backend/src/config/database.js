const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa.');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        process.exit(1);
    }
}

module.exports = { sequelize, connectDB };