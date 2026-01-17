import { useEffect, useState } from "react";
import MovimientoList  from './MovimientoList'
import {
  listarCuentas,
  eliminarCuenta,
  crearCuenta,
  actualizarCuenta,
} from "../api/cuentaApi";
import type { Cuenta } from "../model/Cuenta";
import CuentaForm from "./CuentaForm";

interface Props {
  clienteId?: number; // Opcional: si viene, lista solo las cuentas de ese cliente
}

export default function CuentaList({ clienteId }: Props) {
  const [cuentaMov, setCuentaMov] = useState<string | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cuentaEdit, setCuentaEdit] = useState<Cuenta | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const cargarCuentas = () => {
    listarCuentas()
      .then((res) => {
        if (clienteId) {
          setCuentas(res.data.filter((c) => c.clienteId === clienteId));
        } else {
          setCuentas(res.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarCuentas();
  }, [clienteId]);

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar cuenta?")) return;
    await eliminarCuenta(id);
    cargarCuentas();
  };

  const handleGuardar = async (cuenta: Cuenta) => {
    try {
      // Crear solo si hay clienteId
      if (!cuenta.id && !cuenta.clienteId) {
        alert("No se puede crear una cuenta sin seleccionar un cliente");
        return;
      }

      if (cuenta.id) {
        // Actualizar
        await actualizarCuenta(cuenta.id, {
          tipoCuenta: cuenta.tipoCuenta,
          saldoInicial: cuenta.saldoInicial,
          estado: cuenta.estado,
        });
      } else {
        // Crear
        const payload = {
          numeroCuenta: cuenta.numeroCuenta,
          tipoCuenta: cuenta.tipoCuenta,
          saldoInicial: cuenta.saldoInicial,
        };
        await crearCuenta(cuenta.clienteId!, payload);
      }

      setMostrarForm(false);
      setCuentaEdit(null);
      cargarCuentas();
    } catch (error) {
      console.error("Error al guardar cuenta:", error);
      alert("No se pudo guardar la cuenta.");
    }
  };

  const handleNuevo = () => {
    setCuentaEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (cuenta: Cuenta) => {
    setCuentaEdit(cuenta);
    setMostrarForm(true);
  };

  const cuentasFiltradas = cuentas.filter(
    (c) =>
      c.numeroCuenta.includes(busqueda) ||
      (c.tipoCuenta && c.tipoCuenta.toLowerCase().includes(busqueda.toLowerCase())) ||
      (c.clienteNombre && c.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div>
      <h2>{clienteId ? `Cuentas del Cliente ${clienteId}` : "Todas las Cuentas"}</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ marginBottom: 10, padding: 10, borderRadius: 5, border: "1px solid #ccc", outline: "none" }}
        />

        {/* Mostrar botón de crear solo si estamos en la vista de un cliente */}


        {clienteId ? (
          <button onClick={handleNuevo} style={{ background: "yellow", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}>
            Nueva
          </button>


        ) : <div />}
      </div>

      {mostrarForm && (
        <CuentaForm
          cuenta={cuentaEdit ?? undefined}
          clienteId={clienteId ?? cuentaEdit?.clienteId ?? 0}
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarForm(false);
            setCuentaEdit(null);
          }}
        />
      )}

      <table border={1} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Cliente</th>
            <th>Número Cuenta</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
     

        <tbody>
          {cuentasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No se encontraron cuentas
              </td>
            </tr>
          ) : (
            cuentasFiltradas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.clienteNombre}</td>
                <td>{c.numeroCuenta}</td>
                <td>{c.tipoCuenta}</td>
                <td>{c.saldoInicial}</td>
                <td>{c.estado ? "Activa" : "Inactiva"}</td>
                <td>
                  <button onClick={() => handleEditar(c)}>Editar</button>
                  <button onClick={() => handleEliminar(c.id!)}>Eliminar</button>
                  <button onClick={() => setCuentaMov(c.numeroCuenta)}>
                    Movimientos
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
         {cuentaMov && (
  <MovimientoList numeroCuenta={cuentaMov} />
)}
    </div>
  );
}
