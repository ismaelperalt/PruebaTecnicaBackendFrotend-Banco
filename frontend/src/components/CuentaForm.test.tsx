// src/components/CuentaForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CuentaForm from "./CuentaForm";
import { vi } from "vitest";

describe("CuentaForm", () => {
  const clienteId = 1;

  test("renderiza correctamente los inputs y botones", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(<CuentaForm clienteId={clienteId} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    // Inputs y select
    expect(screen.getByPlaceholderText(/Número de Cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Saldo inicial/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Activa/i })).toBeInTheDocument();

    // Botones
    expect(screen.getByRole("button", { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
  });

  test("permite escribir en los inputs, seleccionar tipo y cambiar checkbox", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={clienteId} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    const inputNumero = screen.getByPlaceholderText(/Número de Cuenta/i);
    const selectTipo = screen.getByRole("combobox");
    const inputSaldo = screen.getByPlaceholderText(/Saldo inicial/i);
    const checkbox = screen.getByRole("checkbox", { name: /Activa/i });

    // Interacciones
    await user.type(inputNumero, "654321");
    await user.selectOptions(selectTipo, "CORRIENTE");
    await user.clear(inputSaldo);
    await user.type(inputSaldo, "2000");
    await user.click(checkbox); // desactiva

    // Validaciones
    expect((inputNumero as HTMLInputElement).value).toBe("654321");
    expect((selectTipo as HTMLSelectElement).value).toBe("CORRIENTE");
    expect((inputSaldo as HTMLInputElement).value).toBe("2000");
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });

  test("llama a onGuardar con los datos correctos al hacer submit", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={clienteId} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    // Llenar formulario
    await user.type(screen.getByPlaceholderText(/Número de Cuenta/i), "999888");
    await user.selectOptions(screen.getByRole("combobox"), "AHORRO");
    await user.clear(screen.getByPlaceholderText(/Saldo inicial/i));
    await user.type(screen.getByPlaceholderText(/Saldo inicial/i), "5000");

    // Enviar
    await user.click(screen.getByRole("button", { name: /Guardar/i }));

    // Validar llamada
    expect(mockGuardar).toHaveBeenCalledWith({
      id: undefined,
      numeroCuenta: "999888",
      tipoCuenta: "AHORRO",
      saldoInicial: 5000,
      estado: true,
      clienteId: clienteId,
      clienteNombre: "",
    });
  });

  test("no permite letras en saldoInicial", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={clienteId} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    const inputSaldo = screen.getByPlaceholderText(/Saldo inicial/i);

    // Intentar escribir letras
    await user.clear(inputSaldo);
    await user.type(inputSaldo, "12abc34.5xyz");

    // Validar que solo queden números y punto
    expect((inputSaldo as HTMLInputElement).value).toBe("1234.5");
  });

  test("llama a onCancelar al hacer clic en cancelar", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<CuentaForm clienteId={clienteId} onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(mockCancelar).toHaveBeenCalled();
  });
});
