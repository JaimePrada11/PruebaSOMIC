const express = require('express');
const router = express.Router();
const { validate } = require('../validadores/Validador');
const { validarFacturaKardex } = require('../validadores/KardexValidador');

const kardexController = require('../controladores/FacturaKardexControlador');

router.post('/',validarFacturaKardex, validate,  kardexController.crearFacturaKardex);
router.put('/',validarFacturaKardex, validate,  kardexController.actualizarKardex);
router.get('/:IDFactura', kardexController.obtenerKardexDeFactura);
router.delete('/:id', kardexController.eliminarKardex);

module.exports = router;