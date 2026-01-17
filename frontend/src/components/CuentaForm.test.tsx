// src/components/CuentaForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CuentaForm from "./CuentaForm";
import type { Cuenta } from "../model/Cuenta";
import { vi } from "vitest";

describe("CuentaForm", () => {
  const cuentaMock: Cuenta = {
    id: 1,
    numeroCuenta: "123456",
    tipoCuenta: "AHORRO",
    saldoInicial: 1000,
    estado: true,
    clienteId: 1,
    clienteNombre: "Juan Perez",
  };

  test("renderiza correctamente los inputs y botones", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(<CuentaForm clienteId={1} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    expect(screen.getByPlaceholderText(/número de cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/saldo inicial/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /activa/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  test("permite escribir en los inputs y cambiar el checkbox", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={1} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    const inputNumero = screen.getByPlaceholderText(/número de cuenta/i);
    const selectTipo = screen.getByRole("combobox");
    const inputSaldo = screen.getByPlaceholderText(/saldo inicial/i);
    const checkbox = screen.getByRole("checkbox", { name: /activa/i });

    await user.type(inputNumero, "654321");
    await user.selectOptions(selectTipo, "CORRIENTE");
    await user.clear(inputSaldo);
    await user.type(inputSaldo, "2000");
    await user.click(checkbox); // desactiva

    expect((inputNumero as HTMLInputElement).value).toBe("654321");
    expect((selectTipo as HTMLSelectElement).value).toBe("CORRIENTE");
    expect((inputSaldo as HTMLInputElement).value).toBe("2000");
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });

  test("llama a onGuardar con los datos correctos al hacer submit", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={1} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.type(screen.getByPlaceholderText(/número de cuenta/i), "999888");
    await user.selectOptions(screen.getByRole("combobox"), "AHORRO");
    await user.clear(screen.getByPlaceholderText(/saldo inicial/i));
    await user.type(screen.getByPlaceholderText(/saldo inicial/i), "5000");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(mockGuardar).toHaveBeenCalledWith(
      expect.objectContaining({
        numeroCuenta: "999888",
        tipoCuenta: "AHORRO",
        saldoInicial: 5000,
        estado: true,
        clienteId: 1,
      })
    );
  });

  test("llama a onCancelar al hacer clic en cancelar", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={1} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockCancelar).toHaveBeenCalled();
  });
});
