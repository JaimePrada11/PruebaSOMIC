const Articulo = require('../models/Articulo');
const { validationResult } = require('express-validator');

// Crear un Articulo
const crearArticulo = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ msg: errores.array() });
    }
    try {
        const articulo = await Articulo.create(req.body);
        res.status(201).json({ msg: 'Articulo creado correctamente', articulo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear el articulo' });
    }
};

// Obtener todos los Artículos
const obtenerArticulos = async (req, res) => {
    try {
        const articulos = await Articulo.findAll();
        res.json(articulos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los articulos' });
    }
};

// Obtener un Articulo por ID
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

// Actualizar un Articulo
const actualizarArticulo = async (req, res) => {
    const { id } = req.params;
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ msg: errores.array() });
    }
    try {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ msg: 'Articulo no encontrado' });
        }
        await articulo.update(req.body);
        res.json({ msg: 'Articulo actualizado correctamente', articulo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el articulo' });
    }
};

// Eliminar un Articulo
const eliminarArticulo = async (req, res) => {
    const { id } = req.params;
    try {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ msg: 'Articulo no encontrado' });
        }
        await articulo.destroy(); // Asegúrate de esperar a que se complete la eliminación
        res.json({ msg: `Articulo con ID ${id} eliminado correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el articulo' });
    }
};

module.exports = { crearArticulo, obtenerArticulos, obtenerArticulo, actualizarArticulo, eliminarArticulo };
