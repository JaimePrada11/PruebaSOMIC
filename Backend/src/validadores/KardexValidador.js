const { body } = require('express-validator');

exports.validarFacturaKardex = [
    body('IDFactura').notEmpty().withMessage('IDFactura debe ser un número'),
    body('IDArticulo').notEmpty().withMessage('IDArticulo debe ser un número'),
    body('FacturaKardexCantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser positiva'),
    body('FacturaKardexnaturaleza').isIn(['+', '-']).withMessage('Naturaleza debe ser + o -'),
];
