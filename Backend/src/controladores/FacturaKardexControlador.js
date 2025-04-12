const { FacturaKardex } = require('../models/FacturaKardex');
const { Articulo } = require('../models/Articulo');
const { Factura } = require('../models/Factura');
const { FacturaKardexDTO } = require('../Dto/KardexDto');

// Crear un movimiento de Kardex
const crearFacturaKardex = async (req, res) => {
  try {
    const { IDFactura, IDArticulo, FacturaKardexCantidad, FacturaKardexnaturaleza } = req.body;

    // Verificar si la factura existe
    const factura = await Factura.findByPk(IDFactura);
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

    // Verificar si el artículo existe
    const articulo = await Articulo.findByPk(IDArticulo);
    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });

    // Verificar la naturaleza del movimiento y actualizar el saldo
    if (FacturaKardexnaturaleza === '+') {
      // Si es un movimiento de entrada, aumentamos el saldo
      articulo.ArticuloSaldo += FacturaKardexCantidad;
    } else if (FacturaKardexnaturaleza === '-') {
      // Si es un movimiento de salida, verificamos si hay suficiente saldo
      if (articulo.ArticuloSaldo < FacturaKardexCantidad) {
        return res.status(400).json({ message: 'No hay suficiente stock para esta operación' });
      }
      articulo.ArticuloSaldo -= FacturaKardexCantidad;
    } else {
      return res.status(400).json({ message: 'Naturaleza no válida' });
    }

    // Guardar el movimiento en Kardex
    const kardex = await FacturaKardex.create({
      IDFactura,
      IDArticulo,
      FacturaKardexCantidad,
      FacturaKardexnaturaleza
    });

    // Actualizar el saldo del artículo
    await articulo.save();

    // Retornar la respuesta con los datos del Kardex
    const result = new FacturaKardexDTO(kardex);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el movimiento de Kardex' });
  }
};

// Obtener todos los movimientos de Kardex de una factura
const obtenerKardexDeFactura = async (req, res) => {
  try {
    const { IDFactura } = req.params;

    // Obtener todos los movimientos de Kardex de la factura
    const kardex = await FacturaKardex.findAll({
      where: { IDFactura },
      include: [{
        model: Articulo,
        as: 'Articulo',
        attributes: ['ArticuloNombre', 'ArticuloSaldo']
      }]
    });

    // Si no hay movimientos de Kardex, se devuelve un error
    if (!kardex || kardex.length === 0) {
      return res.status(404).json({ message: 'No se encontraron movimientos de Kardex para esta factura' });
    }

    const result = kardex.map(k => new FacturaKardexDTO(k));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos de Kardex' });
  }
};

// Eliminar un movimiento de Kardex
const eliminarKardex = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el movimiento de Kardex por ID
    const kardex = await FacturaKardex.findByPk(id);
    if (!kardex) return res.status(404).json({ message: 'Movimiento de Kardex no encontrado' });

    // Verificar si la naturaleza es de tipo '-' (salida)
    if (kardex.FacturaKardexnaturaleza === '-') {
      // Si es una salida, revertir el saldo del artículo
      const articulo = await Articulo.findByPk(kardex.IDArticulo);
      articulo.ArticuloSaldo += kardex.FacturaKardexCantidad;
      await articulo.save();
    } else if (kardex.FacturaKardexnaturaleza === '+') {
      // Si es una entrada, reducir el saldo del artículo
      const articulo = await Articulo.findByPk(kardex.IDArticulo);
      articulo.ArticuloSaldo -= kardex.FacturaKardexCantidad;
      await articulo.save();
    }

    // Eliminar el movimiento de Kardex
    await kardex.destroy();

    res.json({ message: 'Movimiento de Kardex eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el movimiento de Kardex' });
  }
};

module.exports = { crearFacturaKardex, obtenerKardexDeFactura, eliminarKardex };
