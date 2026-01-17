// src/components/CuentaList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CuentaList from "./CuentaList";
import { vi } from "vitest";

// 🚨 Mock de la API
vi.mock("../api/cuentaApi", () => ({
  listarCuentas: vi.fn(),
  eliminarCuenta: vi.fn(),
  crearCuenta: vi.fn(),
  actualizarCuenta: vi.fn(),
}));

import {
  listarCuentas,
  eliminarCuenta,
  crearCuenta,
  actualizarCuenta,
} from "../api/cuentaApi";

const cuentasMock = [
  {
    id: 1,
    numeroCuenta: "111111",
    tipoCuenta: "AHORRO",
    saldoInicial: 1000,
    estado: true,
    clienteId: 1,
    clienteNombre: "Juan Perez",
  },
  {
    id: 2,
    numeroCuenta: "222222",
    tipoCuenta: "CORRIENTE",
    saldoInicial: 2000,
    estado: false,
    clienteId: 1,
    clienteNombre: "Juan Perez",
  },
];

// Mock de window.confirm
const confirmMock = vi.spyOn(window, "confirm");

describe("CuentaList", () => {
  beforeEach(() => {
    (listarCuentas as any).mockResolvedValue({ data: cuentasMock });
    (eliminarCuenta as any).mockResolvedValue({});
    (crearCuenta as any).mockResolvedValue({});
    (actualizarCuenta as any).mockResolvedValue({});
    confirmMock.mockReset();
    confirmMock.mockReturnValue(true);
  });

  const renderComponente = (clienteId?: number) =>
    render(<CuentaList clienteId={clienteId} />);

  test("muestra la lista de cuentas", async () => {
    renderComponente(1);

    await waitFor(() => {
      expect(screen.getByText("111111")).toBeInTheDocument();
      expect(screen.getByText("222222")).toBeInTheDocument();
      expect(screen.getAllByText("Juan Perez").length).toBe(2);
    });
  });

  test("filtra cuentas por búsqueda", async () => {
    renderComponente(1);

    const inputBusqueda = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(inputBusqueda, "222");

    await waitFor(() => {
      expect(screen.queryByText("111111")).not.toBeInTheDocument();
      expect(screen.getByText("222222")).toBeInTheDocument();
    });
  });

  test("muestra el formulario al hacer clic en 'Nueva'", async () => {
    renderComponente(1);

    const btnNueva = screen.getByRole("button", { name: /nueva/i });
    await userEvent.click(btnNueva);

    expect(screen.getByText(/nueva cuenta/i)).toBeInTheDocument();
  });

  test("llama a crearCuenta al guardar una cuenta nueva", async () => {
    const user = userEvent.setup();
    renderComponente(1);

    await user.click(screen.getByRole("button", { name: /nueva/i }));

    await user.type(screen.getByPlaceholderText(/número de cuenta/i), "333333");
    await user.selectOptions(screen.getByRole("combobox"), "AHORRO");
    await user.clear(screen.getByPlaceholderText(/saldo inicial/i));
    await user.type(screen.getByPlaceholderText(/saldo inicial/i), "5000");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(crearCuenta).toHaveBeenCalledWith(1, expect.objectContaining({
        numeroCuenta: "333333",
        tipoCuenta: "AHORRO",
        saldoInicial: 5000,
      }));
    });
  });

  test("llama a actualizarCuenta al guardar una cuenta editada", async () => {
    const user = userEvent.setup();
    renderComponente(1);

    await waitFor(() => screen.getByText("111111"));

    const btnEditar = screen.getAllByRole("button", { name: /editar/i })[0];
    await user.click(btnEditar);

    const inputNumero = screen.getByDisplayValue("111111");
    await user.clear(inputNumero);
    await user.type(inputNumero, "111999");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(actualizarCuenta).toHaveBeenCalledWith(1, expect.objectContaining({
        tipoCuenta: "AHORRO",
        saldoInicial: 1000,
        estado: true,
      }));
    });
  });

  test("elimina una cuenta al confirmar", async () => {
    renderComponente(1);

    await waitFor(() => screen.getByText("111111"));

    const btnEliminar = screen.getAllByRole("button", { name: /eliminar/i })[0];
    await userEvent.click(btnEliminar);

    await waitFor(() => {
      expect(eliminarCuenta).toHaveBeenCalledWith(1);
    });
  });
});
