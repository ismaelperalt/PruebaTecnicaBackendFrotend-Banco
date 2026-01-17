import axios from "axios";
import type { Cuenta } from "../model/Cuenta";

const API_URL = "http://localhost:8080/api/cuentas";

// Crear cuenta para un cliente
export const crearCuenta = (clienteId: number, data: { numeroCuenta: string; tipoCuenta: string; saldoInicial: number }) => {
  return axios.post<Cuenta>(`${API_URL}/${clienteId}`, data);
};

// Listar todas las cuentas
export const listarCuentas = () => {
  return axios.get<Cuenta[]>(API_URL);
};

// Obtener cuenta por id
export const obtenerCuenta = (id: number) => {
  return axios.get<Cuenta>(`${API_URL}/${id}`);
};

// Actualizar cuenta
export const actualizarCuenta = (id: number, data: { tipoCuenta: string; saldoInicial: number; estado: boolean }) => {
  return axios.put<Cuenta>(`${API_URL}/${id}`, data);
};

// Eliminar cuenta
export const eliminarCuenta = (id: number) => {
  return axios.delete<void>(`${API_URL}/${id}`);
};
