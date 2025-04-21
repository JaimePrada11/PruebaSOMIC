const express = require('express');
const router = express.Router();
const { validate } = require('../validadores/Validador');
const { validarFactura } = require('../validadores/FacturaValidador')

const facturaController = require('../controladores/FacturaControlador');

router.post('/', validarFactura, validate,  facturaController.crearFactura);
router.put('/:id', validarFactura, validate, facturaController.actualizarFactura)
router.get('/', facturaController.obtenerTodasFacturas);
router.get('/:id', facturaController.obtenerFactura);
router.get('/nit/:NITDocumento', facturaController.obtenerFacturaxNIT);
router.delete('/:id', facturaController.eliminarFactura);

module.exports = router;