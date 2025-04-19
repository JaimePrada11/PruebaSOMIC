class FacturaDTO {
  constructor({ IDFactura, Facturafecha, FacturafechaVencimiento, FacturaNIT, totalCostos, totalVenta }) {
    this.IDFactura = IDFactura;
    this.Facturafecha = Facturafecha;
    this.FacturafechaVencimiento = FacturafechaVencimiento;
    this.NITNombre = FacturaNIT.NITNombre;
    this.NITDocumento = FacturaNIT.NITDocumento;
    this.NITCupo = FacturaNIT.NITCupo;
    this.NITPlazo = FacturaNIT.NITPlazo;
    this.totalCostos = totalCostos;
    this.totalVenta = totalVenta;
  }
}

module.exports =  FacturaDTO ;

