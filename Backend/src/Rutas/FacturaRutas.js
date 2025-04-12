const express = require('express');
const router = express.Router();

const facturaController = require('../controladores/FacturaControlador');

router.post('/', facturaController.crearFactura);
router.get('/', facturaController.obtenerTodasFacturas);
router.get('/:id', facturaController.obtenerFactura);
router.delete('/:id', facturaController.eliminarFactura);

module.exports = router;