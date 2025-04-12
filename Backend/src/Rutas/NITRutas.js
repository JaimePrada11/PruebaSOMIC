const express = require('express');
const router = express.Router();

const nitControlador = require('../controladores/NITControlador');

router.get('/', nitControlador.obtenertodosNIT);
router.get('/:id', nitControlador.obtenerNIT);
router.post('/', nitControlador.crearNIT);
router.put('/:id', nitControlador.actualizarNIT);
router.delete('/:id', nitControlador.eliminarNIT);

module.exports = router;