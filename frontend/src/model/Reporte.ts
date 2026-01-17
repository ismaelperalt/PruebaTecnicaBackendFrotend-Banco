export interface MovimientoReporte {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipoCuenta: string;
  movimiento: number;
  saldoDisponible: number;
}

export interface ReporteResponse {
  cliente: string;
  fechaInicio: string;
  fechaFin: string;
  totalCreditos: number;
  totalDebitos: number;
  movimientos: MovimientoReporte[];
  pdfBase64: string;
}
