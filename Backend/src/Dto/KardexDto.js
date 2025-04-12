class FacturaKardexDTO {
    constructor({ IDFacturaKardex, IDFactura, IDArticulo, FacturaKardexCantidad, FacturaKardexNaturaleza, ArticuloNombre, ArticuloPrecioVenta, ArticuloCostos }) {
        this.IDFacturaKardex = IDFacturaKardex;
        this.IDFactura = IDFactura;
        this.IDArticulo = IDArticulo;
        this.FacturaKardexCantidad = FacturaKardexCantidad;
        this.FacturaKardexNaturaleza = FacturaKardexNaturaleza;
        this.ArticuloNombre = ArticuloNombre;
        this.ArticuloPrecioVenta = ArticuloPrecioVenta;
        this.ArticuloCostos = ArticuloCostos;
    }
}

module.exports = FacturaKardexDTO;
