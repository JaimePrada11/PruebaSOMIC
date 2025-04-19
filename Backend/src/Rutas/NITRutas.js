const express = require('express');
const router = express.Router();
const { validate } = require('../validadores/Validador');
const { validarNIT } = require('../validadores/NITValidador')

const nitControlador = require('../controladores/NITControlador');

router.get('/', nitControlador.obtenertodosNIT);
router.get('/:id', nitControlador.obtenerNIT);
router.get('/documento/:documento', nitControlador.obtenerDocumento);
router.post('/', validarNIT, validate, nitControlador.crearNIT);
router.put('/:id', validarNIT, validate, nitControlador.actualizarNIT);
router.delete('/:id', nitControlador.eliminarNIT);

module.exports = router;