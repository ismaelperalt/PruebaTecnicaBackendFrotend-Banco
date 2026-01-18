// src/components/MovimientoList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovimientoList from "./MovimientoList";
import { vi } from "vitest";

// Mock de las funciones de la API
vi.mock("../api/movimientoApi", () => ({
  listarMovimientos: vi.fn(),
  listarMovimientosPorCuenta: vi.fn(),
  crearMovimiento: vi.fn(),
  eliminarMovimiento: vi.fn(),
}));

import {
  listarMovimientos,
  listarMovimientosPorCuenta,
  crearMovimiento,
  eliminarMovimiento,
} from "../api/movimientoApi";

describe("MovimientoList", () => {
  const movimientosMock = [
    {
      id: 1,
      numeroCuenta: "123",
      tipoMovimiento: "DEPÓSITO",
      valor: 1000,
      saldo: 1000,
      fecha: new Date().toISOString(),
      estado: true,
    },
    {
      id: 2,
      numeroCuenta: "123",
      tipoMovimiento: "RETIRO",
      valor: 500,
      saldo: 500,
      fecha: new Date().toISOString(),
      estado: true,
    },
  ];

  beforeEach(() => {
    (listarMovimientos as any).mockResolvedValue({ data: movimientosMock });
    (listarMovimientosPorCuenta as any).mockResolvedValue({ data: movimientosMock });
    vi.spyOn(window, "confirm").mockReturnValue(true); // confirm siempre true
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza correctamente elementos y tabla", async () => {
    render(<MovimientoList />);

    expect(screen.getByText(/Todos los Movimientos/i)).toBeInTheDocument();

    // usamos getAllByText porque hay varias filas con "123"
    await waitFor(() => {
      const cuentas = screen.getAllByText("123");
      expect(cuentas.length).toBeGreaterThan(0); // al menos una fila
      expect(screen.getByText("DEPÓSITO")).toBeInTheDocument();
      expect(screen.getByText("RETIRO")).toBeInTheDocument();
    });
  });

  test("muestra MovimientoForm al hacer click en 'Nuevo Movimiento'", async () => {
    render(<MovimientoList numeroCuenta="123" />);

    await waitFor(() => screen.getByText(/Movimientos de la Cuenta 123/i));

    const user = userEvent.setup();

    // seleccionamos el botón específicamente por role y nombre
    const botonNuevo = screen.getByRole("button", { name: /Nuevo Movimiento/i });
    await user.click(botonNuevo);

    // verificamos que el form aparece buscando el heading del formulario
    expect(screen.getByRole("heading", { name: /Nuevo Movimiento/i })).toBeInTheDocument();
  });

  test("llama a crearMovimiento al guardar un nuevo movimiento", async () => {
    render(<MovimientoList numeroCuenta="123" />);

    const user = userEvent.setup();
    const botonNuevo = screen.getByRole("button", { name: /Nuevo Movimiento/i });
    await user.click(botonNuevo);

    const inputValor = screen.getByPlaceholderText(/Valor/i);

    await user.clear(inputValor);
    await user.type(inputValor, "2000");

    await user.click(screen.getByRole("button", { name: /Guardar/i }));

    await waitFor(() => {
      expect(crearMovimiento).toHaveBeenCalledWith({
        numeroCuenta: "123",
        valor: 2000,
      });
    });
  });

  test("llama a eliminarMovimiento al hacer click en 'Anular' y confirmar", async () => {
    render(<MovimientoList numeroCuenta="123" />);

    await waitFor(() => screen.getByText("DEPÓSITO"));

    const user = userEvent.setup();
    const botonAnular = screen.getAllByText("Anular")[0]; // usamos getAllByText porque hay más de uno
    await user.click(botonAnular);

    expect(eliminarMovimiento).toHaveBeenCalledWith(1);
  });
});
