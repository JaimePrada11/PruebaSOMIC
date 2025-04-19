const {Articulo} = require('../models/Articulo');
const { sequelize } = require('../config/database');

const crearArticulo = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        const articulo = await Articulo.create(req.body, { transaction: t });
        await t.commit(); 
        res.status(201).json({ msg: 'Articulo creado correctamente', articulo });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ msg: 'Error al crear el articulo' });
    }
};

const obtenerArticulos = async (req, res) => {
    try {
        const articulos = await Articulo.findAll();
        res.json(articulos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los articulos' });
    }
};

const obtenerArticulo = async (req, res) => {
    const { id } = req.params;
    try {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ msg: `Articulo con ID ${id} no encontrado` });
        }
        res.json(articulo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el articulo' });
    }
};

const actualizarArticulo = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction(); 
    try {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ msg: 'Articulo no encontrado' });
        }
        await articulo.update(req.body, { transaction: t });
        await t.commit();
        res.json({ msg: 'Articulo actualizado correctamente', articulo });
    } catch (error) {
        await t.rollback(); 
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el articulo' });
    }
};

const eliminarArticulo = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction(); 
    try {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ msg: 'Articulo no encontrado' });
        }
        await articulo.destroy({ transaction: t });
        await t.commit();
        res.json({ msg: `Articulo con ID ${id} eliminado correctamente` });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el articulo' });
    }
};

module.exports = { crearArticulo, obtenerArticulos, obtenerArticulo, actualizarArticulo, eliminarArticulo };
