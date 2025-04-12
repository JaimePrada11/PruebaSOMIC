const { Factura } = require('../models/Factura');
const { NIT } = require('../models/NIT');
const FacturaDTO = require('../Dto/FacturaDto');

// Crear una nueva factura
const crearFactura = async (req, res) => {
  try {
    const dto = new FacturaDTO(req.body);

    const nit = await NIT.findOne({ where: { NITDocumento: dto.NITDocumento } });
    if (!nit) return res.status(404).json({ message: 'Cliente no encontrado' });

    const fechaFactura = new Date();
    const fechaVencimiento = new Date(fechaFactura);
    fechaVencimiento.setDate(fechaFactura.getDate() + nit.NITPlazo);

    const factura = await Factura.create({
      IDNIT: nit.IDNIT,
      Facturafecha: fechaFactura,
      FacturafechaVencimiento: fechaVencimiento,
      FacturatotalCostos: dto.totalCostos,
      FacturatotalVenta: dto.totalVenta
    });

    const result = new FacturaDTO({
      IDFactura: factura.IDFactura,
      Facturafecha: factura.Facturafecha,
      FacturafechaVencimiento: factura.FacturafechaVencimiento,
      FacturatotalCostos: factura.FacturatotalCostos,
      FacturatotalVenta: factura.FacturatotalVenta,
      FacturaNIT: nit
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la factura' });
  }
};

// Obtener todas las facturas
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

// Obtener una factura específica
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

// Eliminar una factura
const eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Factura.destroy({ where: { IDFactura: id } });

    if (!deleted) return res.status(404).json({ message: 'Factura no encontrada' });

    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la factura' });
  }
};

// Actualizar una factura existente
const actualizarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalCostos, totalVenta } = req.body;

    // Buscar la factura por ID
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

    // Actualizar los valores de la factura
    factura.FacturatotalCostos = totalCostos;
    factura.FacturatotalVenta = totalVenta;

    await factura.save();

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
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la factura' });
  }
};

module.exports = {
  crearFactura,
  obtenerTodasFacturas,
  obtenerFactura,
  eliminarFactura,
  actualizarFactura
};
