import { useEffect, useState } from "react";
import {
  listarMovimientos,
  listarMovimientosPorCuenta,
  crearMovimiento,
  eliminarMovimiento,
} from "../api/movimientoApi";
import type { Movimiento } from "../model/Movimiento";
import MovimientoForm from "./MovimientoForm";

interface Props {
  numeroCuenta?: string; // 🔹 opcional
}

export default function MovimientoList({ numeroCuenta }: Props) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarMovimientos = () => {
    if (numeroCuenta) {
      listarMovimientosPorCuenta(numeroCuenta)
        .then((res) => setMovimientos(res.data))
        .catch(console.error);
    } else {
      listarMovimientos()
        .then((res) => setMovimientos(res.data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, [numeroCuenta]);

  const handleGuardar = async (valor: number) => {
    if (!numeroCuenta) return;

    await crearMovimiento({
      numeroCuenta,
      valor,
    });

    setMostrarForm(false);
    cargarMovimientos();
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Anular movimiento?")) return;
    await eliminarMovimiento(id);
    cargarMovimientos();
  };

  return (
    <div>
      <h2>
        {numeroCuenta
          ? `Movimientos de la Cuenta ${numeroCuenta}`
          : "Todos los Movimientos"}
      </h2>

      {/* 🔹 Botón SOLO cuando estamos en una cuenta */}
      {numeroCuenta && (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 10 }}
        >
          Nuevo Movimiento
        </button>
      )}

      {mostrarForm && numeroCuenta && (
        <MovimientoForm
          numeroCuenta={numeroCuenta}
          onGuardar={handleGuardar}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      <table border={1} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cuenta</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Saldo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No hay movimientos
              </td>
            </tr>
          ) : (
            movimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.numeroCuenta}</td>
                <td>{m.tipoMovimiento}</td>
                <td>{m.valor}</td>
                <td>{m.saldo}</td>
                <td>{new Date(m.fecha).toLocaleString()}</td>
                <td>{m.estado ? "Activo" : "Anulado"}</td>
                <td>
                  <button onClick={() => handleEliminar(m.id!)}>
                    Anular
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
