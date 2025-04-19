const { body } = require('express-validator');

exports.validarFactura = [
    body('NITDocumento').notEmpty().withMessage('El documento del cliente no puede estar vacio')
];
