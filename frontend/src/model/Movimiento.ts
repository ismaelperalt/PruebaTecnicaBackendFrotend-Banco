export interface Movimiento {
  id?: number;
  fecha: string;
  tipoMovimiento: "DEPOSITO" | "RETIRO";
  valor: number;
  saldo: number;
  estado: boolean;
  numeroCuenta: string;
}