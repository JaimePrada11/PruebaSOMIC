class FacturaDTO {
  constructor({ IDFactura, Facturafecha, FacturafechaVencimiento, FacturaNIT, FacturatotalCostos, FacturatotalVenta }) {
    this.IDFactura = IDFactura;
    this.Facturafecha = this.formatearFecha(Facturafecha);
    this.FacturafechaVencimiento = this.formatearFecha(FacturafechaVencimiento);
    this.NITNombre = FacturaNIT?.NITNombre;
    this.NITDocumento = FacturaNIT?.NITDocumento;
    this.NITCupo = FacturaNIT?.NITCupo;
    this.NITPlazo = FacturaNIT?.NITPlazo;
    this.totalCostos = FacturatotalCostos;
    this.totalVenta = FacturatotalVenta;
  }

  formatearFecha(fecha) {
    if (!fecha) return null;
    return new Date(fecha).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}

module.exports = FacturaDTO;
