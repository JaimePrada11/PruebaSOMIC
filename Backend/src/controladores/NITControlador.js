const {NIT} = require('../models/NIT');
const { validationResult } = require('express-validator');

const crearNIT = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() });
    }
    try {
        const nit = await NIT.create(req.body);
        res.status(200).json(nit);
    } catch (error) {
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

const actualizarNIT = async (req, res) => {
    const { id } = req.params;
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() });
    }
    try {
        const nit = await NIT.findByPk(id);
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        await nit.update(req.body);
        res.json(nit);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarNIT = async (req, res) => {
    const { id } = req.params;
    try {
        const nit = await NIT.findByPk(id);
        if (!nit) {
            return res.status(404).json({ msg: 'NIT no encontrado' });
        }
        await nit.destroy();
        res.json({ msg: 'NIT eliminado con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { crearNIT, obtenerNIT, obtenertodosNIT, actualizarNIT, eliminarNIT};