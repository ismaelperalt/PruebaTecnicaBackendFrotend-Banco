import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarClientes,
  eliminarCliente,
  crearCliente,
  actualizarCliente,
} from "../api/clienteApi";
import type { Cliente } from "../model/Cliente";
import ClienteForm from "./ClienteForm";

export default function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const cargarClientes = () => {
    listarClientes()
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    await eliminarCliente(id);
    cargarClientes();
  };

  const handleGuardar = async (cliente: Cliente) => {
    if (cliente.id) {
      await actualizarCliente(cliente.id, cliente);
    } else {
      await crearCliente(cliente);
    }

    setMostrarForm(false);
    setClienteEdit(null);
    cargarClientes();
  };

  const handleNuevo = () => {
    setClienteEdit(null);
    setMostrarForm(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteEdit(cliente);
    setMostrarForm(true);
  };

  /* 🔍 FILTRO DE BÚSQUEDA */
  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.identificacion.includes(busqueda) ||
    c.telefono.includes(busqueda)
  );

  // Dentro de tu componente ClienteList
const navigate = useNavigate();

  return (
    <div>
      <h2>Clientes</h2>

      <div  style={{
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
         <input
        type="text"
        placeholder="Buscar"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: 10,padding:'10px',borderRadius:'5px',border: '1px solid #ccc', 
      outline: 'none'  }}
      />

      <button onClick={handleNuevo} style={ {background:'yellow',padding:'10px',borderRadius:'5px',border: '1px solid #ccc' }}>Nuevo</button>
      </div>

     

      {mostrarForm && (
        <ClienteForm
          cliente={clienteEdit ?? undefined}
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarForm(false);
            setClienteEdit(null);
          }}
        />
      )}

      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No se encontraron clientes
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.identificacion}</td>
                <td>{c.telefono}</td>
                <td>{c.direccion}</td>
                <td>{c.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <button onClick={() => handleEditar(c)}>Editar</button>
                  <button onClick={() => handleEliminar(c.id!)}>
                    Eliminar
                  </button>
                  <button onClick={() => navigate(`/cuentas/${c.id}`)}>Ver Cuentas</button> {/* ✅ Nuevo */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
