import axios from "axios";
import type { Movimiento } from "../model/Movimiento";

const API_URL = "http://localhost:8080/api/movimientos";

export const listarMovimientos = () =>
  axios.get<Movimiento[]>(API_URL);

export const listarMovimientosPorCuenta = (numeroCuenta: string) =>
  axios.get<Movimiento[]>(`${API_URL}/cuenta/${numeroCuenta}`);

export const crearMovimiento = (payload: {
  numeroCuenta: string;
  valor: number;
}) =>
  axios.post(API_URL, payload);

export const eliminarMovimiento = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
