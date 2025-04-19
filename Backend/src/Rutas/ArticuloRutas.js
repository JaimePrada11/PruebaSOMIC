const express = require('express');
const router = express.Router();
const { validate } = require('../validadores/Validador');
const { validarArticulo, validarArticuloActualizacion } = require('../validadores/ArticuloValidador')

const articuloControlador = require('../controladores/ArticuloControlador');

router.get('/', articuloControlador.obtenerArticulos);
router.get('/:id', articuloControlador.obtenerArticulo);
router.post('/',  validarArticulo, validate, articuloControlador.crearArticulo);
router.put('/:id', validarArticuloActualizacion, validate, articuloControlador.actualizarArticulo);
router.delete('/:id', articuloControlador.eliminarArticulo);

module.exports = router;