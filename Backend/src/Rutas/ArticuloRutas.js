const express = require('express');
const router = express.Router();

const articuloControlador = require('../controladores/ArticuloControlador');

router.get('/', articuloControlador.obtenerArticulos);
router.get('/:id', articuloControlador.obtenerArticulo);
router.post('/', articuloControlador.crearArticulo);
router.put('/:id', articuloControlador.actualizarArticulo);
router.delete('/:id', articuloControlador.eliminarArticulo);

module.exports = router;