// src/components/CuentaList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CuentaList from "./CuentaList";
import { vi } from "vitest";

// Mock de las funciones de la API
vi.mock("../api/cuentaApi", () => ({
  listarCuentas: vi.fn(),
  eliminarCuenta: vi.fn(),
  crearCuenta: vi.fn(),
  actualizarCuenta: vi.fn(),
}));

import {
  listarCuentas,
  eliminarCuenta,
  
} from "../api/cuentaApi";

describe("CuentaList", () => {
  const cuentasMock = [
    { id: 1, clienteNombre: "Juan", numeroCuenta: "123", tipoCuenta: "AHORRO", saldoInicial: 1000, estado: true, clienteId: 1 },
    { id: 2, clienteNombre: "Ana", numeroCuenta: "456", tipoCuenta: "CORRIENTE", saldoInicial: 2000, estado: false, clienteId: 2 },
  ];

  beforeEach(() => {
    (listarCuentas as any).mockResolvedValue({ data: cuentasMock });
  });

  test("renderiza elementos iniciales", async () => {
    render(<CuentaList />);

    expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
    expect(screen.getByText(/Todas las Cuentas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Juan")).toBeInTheDocument();
      expect(screen.getByText("Ana")).toBeInTheDocument();
    });
  });

  test("filtra cuentas por búsqueda", async () => {
    render(<CuentaList />);

    const inputBusqueda = screen.getByPlaceholderText(/Buscar/i);

    await waitFor(() => screen.getByText("Juan"));

    const user = userEvent.setup();
    await user.type(inputBusqueda, "Ana");

    expect(screen.queryByText("Juan")).not.toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  test("muestra CuentaForm al hacer click en 'Nueva'", async () => {
    render(<CuentaList clienteId={1} />);

    const user = userEvent.setup();
    const botonNueva = screen.getByText(/Nueva/i);
    await user.click(botonNueva);

    expect(screen.getByText(/Nueva Cuenta/i)).toBeInTheDocument();
  });

  test("muestra CuentaForm al hacer click en 'Editar'", async () => {
    render(<CuentaList />);

    await waitFor(() => screen.getByText("Juan"));

    const user = userEvent.setup();
    const botonEditar = screen.getAllByText("Editar")[0];
    await user.click(botonEditar);

    expect(screen.getByText(/Editar Cuenta/i)).toBeInTheDocument();
  });

  test("llama a eliminarCuenta al hacer click en 'Eliminar' y confirmar", async () => {
    render(<CuentaList />);

    await waitFor(() => screen.getByText("Juan"));

    // Mock de window.confirm
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const user = userEvent.setup();
    const botonEliminar = screen.getAllByText("Eliminar")[0];
    await user.click(botonEliminar);

    expect(eliminarCuenta).toHaveBeenCalledWith(1);
  });
});
