const { body } = require('express-validator');

exports.validarFacturaKardex = [
    body().isArray().withMessage('Debe enviar una lista de registros'),
    body('*.IDFactura').isInt().withMessage('IDFactura debe ser un número'),
    body('*.IDArticulo').isInt().withMessage('IDArticulo debe ser un número'),
    body('*.FacturaKardexCantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser positiva'),
    body('*.FacturaKardexnaturaleza').isIn(['E', 'S']).withMessage('Naturaleza debe ser E o S'),
];
