import axios from "axios";

import type { Cliente } from '../model/Cliente';

const API_URL = "http://localhost:8080/api/clientes";

export const crearCliente = (data: Cliente) => {
  return axios.post<Cliente>(API_URL, data);
};

export const listarClientes = () => {
  return axios.get<Cliente[]>(API_URL);
};

export const obtenerCliente = (id: number) => {
  return axios.get<Cliente>(`${API_URL}/${id}`);
};

export const actualizarCliente = (id: number, data: Cliente) => {
  return axios.put<Cliente>(`${API_URL}/${id}`, data);
};

export const eliminarCliente = (id: number) => {
  return axios.delete<void>(`${API_URL}/${id}`);
};
