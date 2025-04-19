const { FacturaKardex } = require('../models/FacturaKardex');
const { Articulo } = require('../models/Articulo');
const { Factura } = require('../models/Factura');
const { NIT } = require('../models/NIT');
const  FacturaKardexDTO  = require('../Dto/KardexDto');
const { sequelize } = require('../config/database');

const crearFacturaKardex = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { IDFactura, IDArticulo, FacturaKardexCantidad, FacturaKardexnaturaleza } = req.body;
    const cantidad = Number(FacturaKardexCantidad);

    const factura = await Factura.findByPk(IDFactura, { transaction: t });
    if (!factura) {
      await t.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const articulo = await Articulo.findByPk(IDArticulo, { transaction: t });
    if (!articulo) {
      await t.rollback();
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    const nit = await NIT.findByPk(factura.IDNIT, { transaction: t }); // Obtener NIT asociado a la factura
    if (!nit) {
      await t.rollback();
      return res.status(404).json({ message: 'NIT no encontrado' });
    }

    // Inicializa totales por si están en null
    factura.FacturatotalCostos = Number(factura.FacturatotalCostos) || 0;
    factura.FacturatotalVenta = Number(factura.FacturatotalVenta) || 0;

    let totalCostos = 0;
    let totalVenta = 0;

    if (FacturaKardexnaturaleza === '+') {
      // COMPRA
      articulo.ArticuloSaldo += cantidad;
      totalCostos = articulo.ArticuloCostos * cantidad;
      factura.FacturatotalCostos += totalCostos;

    } else if (FacturaKardexnaturaleza === '-') {
      // VENTA
      if (articulo.ArticuloSaldo < cantidad) {
        await t.rollback();
        return res.status(400).json({ message: 'No hay suficiente stock para esta operación' });
      }

      // Verificar si hay suficiente cupo en el NIT para esta venta
      const totalVentaAfectado = articulo.ArticuloPrecioVenta * cantidad;
      if (nit.NITCupo < totalVentaAfectado) {
        await t.rollback();
        return res.status(400).json({ message: 'No hay suficiente cupo disponible para esta venta' });
      }

      nit.NITCupo -= totalVentaAfectado; // Descontar el monto del cupo disponible
      articulo.ArticuloSaldo -= cantidad;
      totalVenta = totalVentaAfectado;
      factura.FacturatotalVenta += totalVenta;
    } else {
      await t.rollback();
      return res.status(400).json({ message: 'Naturaleza no válida (usa "+" o "-")' });
    }

    // Guardar movimiento en el Kardex
    const kardex = await FacturaKardex.create({
      IDFactura,
      IDArticulo,
      FacturaKardexCantidad: cantidad,
      FacturaKardexnaturaleza
    }, { transaction: t });

    await articulo.save({ transaction: t });
    await nit.save({ transaction: t }); // Guardar cambios en el NIT

    // Preparar respuesta DTO
    const result = new FacturaKardexDTO({
      ...kardex.dataValues,
      FacturaKardexnaturaleza,
      ArticuloNombre: articulo.ArticuloNombre,
      ArticuloPrecioVenta: articulo.ArticuloPrecioVenta,
      ArticuloCostos: articulo.ArticuloCostos,
      totalCostos,
      totalVenta
    });

    // Redondear antes de guardar
    factura.FacturatotalCostos = Number(factura.FacturatotalCostos.toFixed(2));
    factura.FacturatotalVenta = Number(factura.FacturatotalVenta.toFixed(2));

    await factura.save({ transaction: t });

    await t.commit();
    res.status(201).json(result);

  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ message: 'Error al crear el movimiento de Kardex' });
  }
};




const obtenerKardexDeFactura = async (req, res) => {
  try {
    const { IDFactura } = req.params;

    const kardex = await FacturaKardex.findAll({
      where: { IDFactura },
      include: [{
        model: Articulo,
        as: 'Articulo',
        attributes: ['ArticuloNombre', 'ArticuloSaldo']
      }]
    });

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

const eliminarKardex = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const kardex = await FacturaKardex.findByPk(id, { transaction: t });
    if (!kardex) return res.status(404).json({ message: 'Movimiento de Kardex no encontrado' });

    const articulo = await Articulo.findByPk(kardex.IDArticulo, { transaction: t });
    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });

    const factura = await Factura.findByPk(kardex.IDFactura, { transaction: t });
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

    if (kardex.FacturaKardexnaturaleza === '-') {
      articulo.ArticuloSaldo += kardex.FacturaKardexCantidad;

      const restaVenta = articulo.ArticuloPrecioVenta * kardex.FacturaKardexCantidad;
      factura.FacturatotalVenta -= restaVenta;
      if (factura.FacturatotalVenta < 0) factura.FacturatotalVenta = 0;

    } else if (kardex.FacturaKardexnaturaleza === '+') {
      articulo.ArticuloSaldo -= kardex.FacturaKardexCantidad;

      const restaCosto = articulo.ArticuloCostos * kardex.FacturaKardexCantidad;
      factura.FacturatotalCostos -= restaCosto;
      if (factura.FacturatotalCostos < 0) factura.FacturatotalCostos = 0;
    }

    // Guardar cambios
    await articulo.save({ transaction: t });
    await factura.save({ transaction: t });

    // Eliminar el movimiento
    await kardex.destroy({ transaction: t });

    await t.commit();

    res.json({ message: 'Movimiento de Kardex eliminado correctamente' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el movimiento de Kardex' });
  }
};


const actualizarKardex = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { FacturaKardexCantidad, FacturaKardexnaturaleza } = req.body;

    const kardex = await FacturaKardex.findByPk(id, { transaction: t });
    if (!kardex) return res.status(404).json({ message: 'Movimiento de Kardex no encontrado' });

    const articulo = await Articulo.findByPk(kardex.IDArticulo, { transaction: t });
    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });

    if (kardex.FacturaKardexnaturaleza === '-') {
      articulo.ArticuloSaldo += kardex.FacturaKardexCantidad;
    } else if (kardex.FacturaKardexnaturaleza === '+') {
      articulo.ArticuloSaldo -= kardex.FacturaKardexCantidad;
    }

    kardex.FacturaKardexCantidad = FacturaKardexCantidad;
    kardex.FacturaKardexnaturaleza = FacturaKardexnaturaleza;

    if (FacturaKardexnaturaleza === '+') {
      articulo.ArticuloSaldo += FacturaKardexCantidad;
    } else if (FacturaKardexnaturaleza === '-') {
      if (articulo.ArticuloSaldo < FacturaKardexCantidad) {
        return res.status(400).json({ message: 'No hay suficiente stock para esta operación' });
      }
      articulo.ArticuloSaldo -= FacturaKardexCantidad;
    } else {
      return res.status(400).json({ message: 'Naturaleza no válida' });
    }

    await articulo.save({ transaction: t });
    await kardex.save({ transaction: t });

    await t.commit();

    const result = new FacturaKardexDTO({
      ...kardex.dataValues,
      ArticuloNombre: articulo.ArticuloNombre,
      ArticuloPrecioVenta: articulo.ArticuloPrecioVenta,
      ArticuloCostos: articulo.ArticuloCostos
    });

    res.json(result);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el movimiento de Kardex' });
  }
};


module.exports = { crearFacturaKardex, actualizarKardex, obtenerKardexDeFactura, eliminarKardex };
