const { body } = require('express-validator');

exports.validarNIT = [
    body('NITNombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('NITDocumento').notEmpty().withMessage('El documento es obligatorio'),
    body('NITCupo').notEmpty().withMessage('El cupo es obligatorio'),
    body('NITPlazo').notEmpty().withMessage('El plazo es obligatorio')
        .isInt({ min: 0 }).withMessage('El plazo debe ser un número entero positivo'),
];

exports.validarNITActualizar = [
    body('NITNombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    body('NITDocumento').optional().notEmpty().withMessage('El documento es obligatorio'),
    body('NITCupo').optional().notEmpty().withMessage('El cupo es obligatorio'),
    body('NITPlazo').optional().notEmpty().withMessage('El plazo es obligatorio')
        .isInt({ min: 0 }).withMessage('El plazo debe ser un número entero positivo'),
];
