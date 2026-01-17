import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MovimientoList from "./MovimientoList";
import {
  listarMovimientosPorCuenta,
  crearMovimiento,
  eliminarMovimiento,
} from "../api/movimientoApi";

// 🔹 Mock de la API
vi.mock("../api/movimientoApi");

describe("MovimientoList", () => {
  const movimientosMock = [
    {
      id: 1,
      numeroCuenta: "111",
      tipoMovimiento: "DEPOSITO",
      valor: 500,
      saldo: 1500,
      fecha: "2026-01-17T00:00:00",
      estado: true,
    },
    {
      id: 2,
      numeroCuenta: "111",
      tipoMovimiento: "RETIRO",
      valor: -200,
      saldo: 1300,
      fecha: "2026-01-17T01:00:00",
      estado: true,
    },
  ];

  beforeEach(() => {
    (listarMovimientosPorCuenta as any).mockResolvedValue({ data: movimientosMock });
    (crearMovimiento as any).mockResolvedValue({});
    (eliminarMovimiento as any).mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("muestra la lista de movimientos", async () => {
    render(<MovimientoList numeroCuenta="111" />);
    expect(await screen.findByText(/DEPOSITO/i)).toBeInTheDocument();
    expect(screen.getByText(/RETIRO/i)).toBeInTheDocument();
  });

  test("abre el formulario al hacer clic en 'Nuevo Movimiento'", async () => {
    render(<MovimientoList numeroCuenta="111" />);
    const btnNuevo = screen.getByText(/Nuevo Movimiento/i, { selector: "button" });
    await userEvent.click(btnNuevo);

    // Verifica que el formulario se muestre
    expect(screen.getByRole("textbox", { name: "" })).toHaveValue("111");
    expect(screen.getByPlaceholderText(/\+ depósito \/ - retiro/i)).toBeInTheDocument();
  });

  test("llama a crearMovimiento al guardar un nuevo movimiento", async () => {
    render(<MovimientoList numeroCuenta="111" />);
    const btnNuevo = screen.getByText(/Nuevo Movimiento/i, { selector: "button" });
    await userEvent.click(btnNuevo);

    const inputValor = screen.getByPlaceholderText(/\+ depósito \/ - retiro/i);
    await userEvent.type(inputValor, "1000");

    const btnGuardar = screen.getByRole("button", { name: /Guardar/i });
    await userEvent.click(btnGuardar);

    await waitFor(() => {
      expect(crearMovimiento).toHaveBeenCalledWith({
        numeroCuenta: "111",
        valor: 1000,
      });
    });
  });

  test("anula un movimiento al confirmar", async () => {
    // Mock de window.confirm
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MovimientoList numeroCuenta="111" />);
    const btnAnular = await screen.findAllByText(/Anular/i);
    await userEvent.click(btnAnular[0]);

    await waitFor(() => {
      expect(eliminarMovimiento).toHaveBeenCalledWith(1);
    });

    confirmSpy.mockRestore();
  });
});
