const { body } = require('express-validator');

exports.FacturaValidador = [
    body('IDNIT').isInt().withMessage('IDNIT debe ser un número'),
    body('Facturafecha').isISO8601().withMessage('Fecha inválida'),
    body('FacturafechaVencimiento').isISO8601().withMessage('Fecha de vencimiento inválida'),
    body('FacturatotalCostos').isDecimal().withMessage('Total de costos inválido'),
    body('FacturatotalVenta').isDecimal().withMessage('Total de venta inválido'),
];
