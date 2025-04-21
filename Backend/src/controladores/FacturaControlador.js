const { Factura } = require('../models/Factura');
const { NIT } = require('../models/NIT');
const { Articulo } = require('../models/Articulo')
const FacturaDTO = require('../Dto/FacturaDto');
const { sequelize } = require('../config/database');
const { FacturaKardex } = require('../models/FacturaKardex');

const crearFactura = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { NITDocumento } = req.body;

    const nit = await NIT.findOne({ where: { NITDocumento: NITDocumento }, transaction: t });
    if (!nit) return res.status(404).json({ message: 'Cliente no encontrado' });

    const ahora = new Date();
    const offsetMinutos = ahora.getTimezoneOffset(); // por ejemplo, -300 para Colombia
    const fechaFactura = new Date(ahora.getTime() - offsetMinutos * 60 * 1000);

    const fechaVencimiento = new Date(fechaFactura);
    fechaVencimiento.setDate(fechaFactura.getDate() + nit.NITPlazo);


    const factura = await Factura.create({
      IDNIT: nit.IDNIT,
      Facturafecha: fechaFactura,
      FacturafechaVencimiento: fechaVencimiento,
      FacturatotalCostos: 0,
      FacturatotalVenta: 0
    }, { transaction: t });

    const result = new FacturaDTO({
      IDFactura: factura.IDFactura,
      Facturafecha: factura.Facturafecha,
      FacturafechaVencimiento: factura.FacturafechaVencimiento,
      FacturatotalCostos: factura.FacturatotalCostos,
      FacturatotalVenta: factura.FacturatotalVenta,
      FacturaNIT: nit
    });
    await t.commit()
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ message: 'Error al crear la factura' });
  }
};


const obtenerTodasFacturas = async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      include: [{
        model: NIT,
        as: 'FacturaNIT',
        attributes: ['NITNombre', 'NITDocumento', 'NITCupo', 'NITPlazo']
      }]
    });

    const result = facturas.map(factura => new FacturaDTO(factura.toJSON()));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las facturas' });
  }
};


const obtenerFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findByPk(id, {
      include: [{
        model: NIT,
        as: 'FacturaNIT',
        attributes: ['NITNombre', 'NITDocumento', 'NITCupo', 'NITPlazo']
      }]
    });

    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

    const result = new FacturaDTO(factura);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la factura' });
  }
};

const obtenerFacturaxNIT = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { NITDocumento } = req.params

    const nit = await NIT.findOne({ where: { NITDocumento }, transaction: t })
    if (!nit) {
      await t.rollback()
      return res.status(404).json({ message: 'NIT no encontrado' });
    }

    const facturas = await Factura.findAll({
      where: { IDNIT: nit.IDNIT },
      include: [{
        model: NIT,
        as: 'FacturaNIT',
        attributes: ['NITNombre', 'NITDocumento', 'NITCupo', 'NITPlazo']
      }],
      order: [['Facturafecha', 'DESC']],
      transaction: t
    })

    if (!facturas.length) {
      await t.commit();
      return res.status(404).json({ message: 'No se encontraron facturas para este NIT' });
    }

    const result = facturas.map(factura => new FacturaDTO(factura.toJSON()));
    await t.commit();
    res.json(result);

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al obtener las facturas por NIT' });
  }
}

const eliminarFactura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const factura = await Factura.findByPk(id, { transaction: t });
    if (!factura) {
      await t.rollback();
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const nit = await NIT.findByPk(factura.IDNIT, { transaction: t });
    if (!nit) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente (NIT) no encontrado' });
    }

    const kardexMovimientos = await FacturaKardex.findAll({
      where: { IDFactura: id },
      transaction: t
    });

    for (const movimiento of kardexMovimientos) {
      const articulo = await Articulo.findByPk(movimiento.IDArticulo, { transaction: t });
      if (!articulo) {
        await t.rollback();
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }

      const cantidad = movimiento.FacturaKardexCantidad;

      if (movimiento.FacturaKardexnaturaleza === '-') {
        articulo.ArticuloSaldo += cantidad;
        nit.NITCupo = parseFloat(nit.NITCupo) + articulo.ArticuloPrecioVenta * cantidad;
        nit.NITCupo = parseFloat(nit.NITCupo.toFixed(2));
        factura.FacturatotalVenta -= articulo.ArticuloPrecioVenta * cantidad;
      } else if (movimiento.FacturaKardexnaturaleza === '+') {
        articulo.ArticuloSaldo -= cantidad;
        factura.FacturatotalCostos -= articulo.ArticuloCostos * cantidad;
      }

      await articulo.save({ transaction: t });
    }
    await nit.save({ transaction: t });

    factura.FacturatotalVenta = Math.max(0, factura.FacturatotalVenta);
    factura.FacturatotalCostos = Math.max(0, factura.FacturatotalCostos);


    await factura.save({ transaction: t });

    await FacturaKardex.destroy({
      where: { IDFactura: id },
      transaction: t
    });

    await Factura.destroy({ where: { IDFactura: id }, transaction: t });

    await t.commit();
    res.json({ message: 'Factura eliminada correctamente.' });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la factura.' });
  }
};


const actualizarFactura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { totalCostos, totalVenta } = req.body;


    const factura = await Factura.findByPk(id);
    if (!factura) {
      await t.rollback()
      return res.status(404).json({ message: 'Factura no encontrada' });

    }
    factura.FacturatotalCostos = totalCostos;
    factura.FacturatotalVenta = totalVenta;

    await factura.save({ transaction: t });
    await t.commit()

    const updatedFacturaDTO = new FacturaDTO({
      IDFactura: factura.IDFactura,
      Facturafecha: factura.Facturafecha,
      FacturafechaVencimiento: factura.FacturafechaVencimiento,
      FacturatotalCostos: factura.FacturatotalCostos,
      FacturatotalVenta: factura.FacturatotalVenta,
      FacturaNIT: factura.FacturaNIT
    });

    res.json(updatedFacturaDTO);
  } catch (error) {
    await t.rollback()
    res.status(500).json({ message: 'Error al actualizar la factura' });
  }
};

module.exports = {
  crearFactura, obtenerTodasFacturas, obtenerFactura, obtenerFacturaxNIT, eliminarFactura, actualizarFactura
};
