// src/components/ClienteList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom"; // necesario para useNavigate

// 🔹 Mock global de useNavigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// 🔹 Mock de la API
vi.mock("../api/clienteApi", () => ({
  listarClientes: vi.fn(),
  eliminarCliente: vi.fn(),
  crearCliente: vi.fn(),
  actualizarCliente: vi.fn(),
}));

import ClienteList from "./ClienteList";
import {
  listarClientes,
  eliminarCliente,
  crearCliente,
  actualizarCliente,
} from "../api/clienteApi";

// 🔹 Datos de prueba
const clientesMock = [
  {
    id: 1,
    nombre: "Juan Perez",
    identificacion: "1234567890",
    telefono: "0999999999",
    direccion: "Av Siempre Viva 123",
    estado: true,
  },
  {
    id: 2,
    nombre: "Maria Gomez",
    identificacion: "0987654321",
    telefono: "0998887777",
    direccion: "Calle Falsa 456",
    estado: false,
  },
];

// 🔹 Mock de confirm
const confirmMock = vi.spyOn(window, "confirm");

describe("ClienteList", () => {
  beforeEach(() => {
    (listarClientes as any).mockResolvedValue({ data: clientesMock });
    (eliminarCliente as any).mockResolvedValue({});
    (crearCliente as any).mockResolvedValue({});
    (actualizarCliente as any).mockResolvedValue({});
    confirmMock.mockReset();
    confirmMock.mockReturnValue(true); // siempre aceptar confirm
    navigateMock.mockReset();
  });

  const renderComponente = () =>
    render(
      <BrowserRouter>
        <ClienteList />
      </BrowserRouter>
    );

  test("muestra la lista de clientes", async () => {
    renderComponente();

    await waitFor(() => {
      expect(screen.getByText("Juan Perez")).toBeInTheDocument();
      expect(screen.getByText("Maria Gomez")).toBeInTheDocument();
    });
  });

  test("filtra clientes por búsqueda", async () => {
    renderComponente();

    const inputBusqueda = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(inputBusqueda, "Maria");

    await waitFor(() => {
      expect(screen.queryByText("Juan Perez")).not.toBeInTheDocument();
      expect(screen.getByText("Maria Gomez")).toBeInTheDocument();
    });
  });

  test("muestra el formulario al hacer clic en 'Nuevo'", async () => {
    renderComponente();

    const btnNuevo = screen.getByRole("button", { name: /nuevo/i });
    await userEvent.click(btnNuevo);

    expect(screen.getByText(/nuevo cliente/i)).toBeInTheDocument();
  });

  test("muestra formulario con datos al hacer clic en 'Editar'", async () => {
    renderComponente();

    await waitFor(() => screen.getByText("Juan Perez"));

    const btnEditar = screen.getAllByRole("button", { name: /editar/i })[0];
    await userEvent.click(btnEditar);

    expect(screen.getByDisplayValue("Juan Perez")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  test("elimina un cliente al confirmar", async () => {
    renderComponente();

    await waitFor(() => screen.getByText("Juan Perez"));

    const btnEliminar = screen.getAllByRole("button", { name: /eliminar/i })[0];
    await userEvent.click(btnEliminar);

    await waitFor(() => {
      expect(eliminarCliente).toHaveBeenCalledWith(1);
    });
  });
test("llama a crearCliente al guardar un cliente nuevo", async () => {
  renderComponente();

  const btnNuevo = screen.getByRole("button", { name: /nuevo/i });
  await userEvent.click(btnNuevo);

  // rellenar todos los inputs requeridos
  const inputNombre = screen.getByPlaceholderText(/nombre/i);
  const inputIdentificacion = screen.getByPlaceholderText(/identificación/i);
  const inputTelefono = screen.getByPlaceholderText(/teléfono/i); // opcional
  const inputDireccion = screen.getByPlaceholderText(/dirección/i); // opcional

  await userEvent.type(inputNombre, "Pedro");
  await userEvent.type(inputIdentificacion, "1122334455");
  await userEvent.type(inputTelefono, "0999999999"); // opcional, pero útil
  await userEvent.type(inputDireccion, "Calle Nueva 123"); // opcional

  const btnGuardar = screen.getByRole("button", { name: /guardar/i });
  await userEvent.click(btnGuardar);

  await waitFor(() => {
    expect(crearCliente).toHaveBeenCalled(); // ✅ ahora sí se llamará
  });
});

  test("llama a actualizarCliente al guardar un cliente editado", async () => {
    renderComponente();

    await waitFor(() => screen.getByText("Juan Perez"));

    const btnEditar = screen.getAllByRole("button", { name: /editar/i })[0];
    await userEvent.click(btnEditar);

    const inputNombre = screen.getByDisplayValue("Juan Perez");
    await userEvent.clear(inputNombre);
    await userEvent.type(inputNombre, "Juan Modificado");

    const btnGuardar = screen.getByRole("button", { name: /guardar/i });
    await userEvent.click(btnGuardar);

    await waitFor(() => {
      expect(actualizarCliente).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ nombre: "Juan Modificado" })
      );
    });
  });

  test("navega a cuentas al hacer clic en 'Ver Cuentas'", async () => {
    renderComponente();

    await waitFor(() => screen.getByText("Juan Perez"));

    const btnVerCuentas = screen.getAllByRole("button", { name: /ver cuentas/i })[0];
    await userEvent.click(btnVerCuentas);

    expect(navigateMock).toHaveBeenCalledWith("/cuentas/1");
  });
});
