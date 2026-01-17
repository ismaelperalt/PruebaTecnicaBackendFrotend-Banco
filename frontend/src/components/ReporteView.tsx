import { useState } from "react";
import { generarReporte } from "../api/reporteApi";
import type { ReporteResponse } from "../model/Reporte";

export default function ReporteView() {
  const [clienteId, setClienteId] = useState<number>(0);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [reporte, setReporte] = useState<ReporteResponse | null>(null);

  const handleGenerar = async () => {
    if (!clienteId || !inicio || !fin) {
      alert("Completa todos los campos");
      return;
    }

    const res = await generarReporte(clienteId, inicio, fin);
    setReporte(res.data);
  };

  const descargarPdf = () => {
    if (!reporte?.pdfBase64) return;

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${reporte.pdfBase64}`;
    link.download = `reporte_${reporte.cliente}.pdf`;
    link.click();
  };

  return (
    <div>
      <h2>Reporte de Estado de Cuenta</h2>

      <input
        type="number"
        placeholder="ID Cliente"
        value={clienteId || ""}
        onChange={(e) => setClienteId(Number(e.target.value))}
      />

      <input
        type="date"
        value={inicio}
        onChange={(e) => setInicio(e.target.value)}
      />

      <input
        type="date"
        value={fin}
        onChange={(e) => setFin(e.target.value)}
      />

      <button onClick={handleGenerar}>Generar Reporte</button>

      {reporte && (
        <>
          <h3>Cliente: {reporte.cliente}</h3>
          <p>Total Créditos: {reporte.totalCreditos}</p>
          <p>Total Débitos: {reporte.totalDebitos}</p>

          <button onClick={descargarPdf}>Descargar PDF</button>
        </>
      )}
    </div>
  );
}
