const { body } = require('express-validator');

exports.validarArticulo = [
    body('ArticuloNombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('ArticuloLaboratorio').notEmpty().withMessage('El laboratorio es obligatorio'),
    body('ArticuloSaldo').isInt({ min: 0 }).withMessage('El saldo debe ser un número entero'),
    body('ArticuloCostos').isDecimal().withMessage('Costo inválido'),
    body('ArticuloPrecioVenta').isDecimal().withMessage('Precio de venta inválido')
];

exports.validarArticuloActualizacion = [
    body('ArticuloNombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    body('ArticuloLaboratorio').optional().notEmpty().withMessage('El laboratorio es obligatorio'),
    body('ArticuloSaldo').optional().isInt({ min: 0 }).withMessage('El saldo debe ser un número entero'),
    body('ArticuloCostos').optional().isDecimal().withMessage('Costo inválido'),
    body('ArticuloPrecioVenta').optional().isDecimal().withMessage('Precio de venta inválido')
];