// src/components/MovimientoForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovimientoForm from "./MovimientoForm";
import { vi } from "vitest";

describe("MovimientoForm", () => {
  const onGuardar = vi.fn();
  const onCancelar = vi.fn();

  beforeEach(() => {
    onGuardar.mockReset();
    onCancelar.mockReset();
  });

  test("renderiza correctamente", () => {
    render(<MovimientoForm numeroCuenta="111111" onGuardar={onGuardar} onCancelar={onCancelar} />);

    expect(screen.getByText(/nuevo movimiento/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("111111")).toBeDisabled();
    expect(screen.getByPlaceholderText(/valor/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  test("permite escribir un valor y llamar onGuardar", async () => {
    const user = userEvent.setup();
    render(<MovimientoForm numeroCuenta="111111" onGuardar={onGuardar} onCancelar={onCancelar} />);

    const inputValor = screen.getByPlaceholderText(/valor/i);
    await user.clear(inputValor);
    await user.type(inputValor, "500");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(onGuardar).toHaveBeenCalledWith(500);
  });

  test("llama a onCancelar al hacer clic en cancelar", async () => {
    const user = userEvent.setup();
    render(<MovimientoForm numeroCuenta="111111" onGuardar={onGuardar} onCancelar={onCancelar} />);

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onCancelar).toHaveBeenCalled();
  });
});
