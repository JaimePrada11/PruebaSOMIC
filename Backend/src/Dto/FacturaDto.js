class FacturaDTO {
  constructor({ IDFactura, Facturafecha, FacturafechaVencimiento, FacturaNIT, FacturatotalCostos, FacturatotalVenta }) {
    this.IDFactura = IDFactura;
    this.Facturafecha = Facturafecha;
    this.FacturafechaVencimiento = FacturafechaVencimiento;
    this.NITNombre = FacturaNIT?.NITNombre;
    this.NITDocumento = FacturaNIT?.NITDocumento;
    this.NITCupo = FacturaNIT?.NITCupo;
    this.NITPlazo = FacturaNIT?.NITPlazo;
    this.totalCostos = FacturatotalCostos;
    this.totalVenta = FacturatotalVenta;
  }
}

module.exports = FacturaDTO;
