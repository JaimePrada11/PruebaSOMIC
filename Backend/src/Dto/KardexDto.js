class FacturaKardexDTO {
    constructor({ IDFacturaKardex, IDFactura, IDArticulo, FacturaKardexCantidad, FacturaKardexnaturaleza, ArticuloNombre, ArticuloPrecioVenta, ArticuloCostos, totalCostos = 0, totalVenta = 0 }) {

        this.IDFacturaKardex = IDFacturaKardex;
        this.IDFactura = IDFactura;
        this.IDArticulo = IDArticulo;
        this.FacturaKardexCantidad = FacturaKardexCantidad;
        this.ArticuloNombre = ArticuloNombre;

        if (FacturaKardexnaturaleza === '+') {
            this.ArticuloCostos = ArticuloCostos;
            this.totalCostos = totalCostos;
        } else if (FacturaKardexnaturaleza === '-') {
            this.ArticuloPrecioVenta = ArticuloPrecioVenta;
            this.totalVenta = totalVenta;
        }
    }
}

module.exports = FacturaKardexDTO;
