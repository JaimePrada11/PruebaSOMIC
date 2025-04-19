const { NIT } = require('../models/NIT');
const { sequelize } = require('../config/database');

const crearNIT = async (req, res) => {
    const t =  await sequelize.transaction()
    try {
        const nit = await NIT.create(req.body, { transaction: t });
        await t.commit();
        res.status(200).json(nit);
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: 'El documento ya está registrado' });
        }
        
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

const obtenertodosNIT = async (req, res) => {
    try {
        const nit = await NIT.findAll();
        res.json(nit)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerNIT = async (req, res) => {
    const { id } = req.params;
    try {
        const nit = await NIT.findByPk(id);
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        res.json(nit);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerDocumento = async (req, res) => {
    const { documento } = req.params;
    try {
        const nit = await NIT.findOne({ where: { NITDocumento: documento } });
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        res.json(nit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const actualizarNIT = async (req, res) => {
    const { id } = req.params;
   const t = await sequelize.transaction()
    try {
        const nit = await NIT.findByPk(id);
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        await nit.update(req.body, { transaction: t });
        await t.commit()
        res.json(nit);

    } catch (error) {
        await t.rollback()
        res.status(400).json({ error: error.message });
    }
};

const eliminarNIT = async (req, res) => {
    const { id } = req.params;
    const t = sequelize.transaction()
    try {
        const nit = await NIT.findByPk(id);
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        await nit.destroy({transaction: t});
        await t.commit()
        res.json({ msg: 'NIT eliminado con éxito' });
    } catch (error) {
        await t.rollback()
        res.status(400).json({ error: error.message });
    }
};

module.exports = { crearNIT, obtenerNIT, obtenertodosNIT, obtenerDocumento, actualizarNIT, eliminarNIT };