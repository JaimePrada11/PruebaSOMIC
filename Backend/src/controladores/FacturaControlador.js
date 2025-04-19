const { Factura } = require('../models/Factura');
const { NIT } = require('../models/NIT');
const FacturaDTO = require('../Dto/FacturaDto');
const { sequelize } = require('../config/database');

const crearFactura = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { NITDocumento } = req.body;

    const nit = await NIT.findOne({ where: { NITDocumento: NITDocumento }, transaction: t });
    if (!nit) return res.status(404).json({ message: 'Cliente no encontrado' });

    const fechaFactura = new Date();
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

    const result = facturas.map(factura => new FacturaDTO(factura));

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

const eliminarFactura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const deleted = await Factura.destroy({ where: { IDFactura: id }, transaction: t });

    if (!deleted) return res.status(404).json({ message: 'Factura no encontrada' });
    
    await t.commit()
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    await t.rollback()
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la factura' });
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
  crearFactura, obtenerTodasFacturas, obtenerFactura, eliminarFactura, actualizarFactura
};
