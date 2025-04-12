const express = require('express');
const router = express.Router();

const kardexController = require('../controladores/FacturaKardexControlador');

router.post('/', kardexController.crearFacturaKardex);
router.get('/', kardexController.obtenerKardexDeFactura);
router.delete('/:id', kardexController.eliminarKardex);

module.exports = router;