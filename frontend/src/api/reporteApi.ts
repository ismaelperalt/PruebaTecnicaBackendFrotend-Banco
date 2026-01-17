import axios from "axios";
import type { ReporteResponse } from "../model/Reporte";

const API_URL = "http://localhost:8080/api/reportes";

export const generarReporte = (
  clienteId: number,
  inicio: string,
  fin: string
) => {
  return axios.get<ReporteResponse>(API_URL, {
    params: { clienteId, inicio, fin },
  });
};
