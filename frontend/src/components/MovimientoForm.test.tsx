import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovimientoForm from "./MovimientoForm";
import { vi } from "vitest";

describe("MovimientoForm", () => {
  const numeroCuenta = "123456";

  test("renderiza inputs y botones", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <MovimientoForm
        numeroCuenta={numeroCuenta}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    expect(screen.getByDisplayValue(numeroCuenta)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Valor/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
  });

  test("permite escribir en el input de valor", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(
      <MovimientoForm
        numeroCuenta={numeroCuenta}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const inputValor = screen.getByPlaceholderText(/Valor/i);
    await user.clear(inputValor);
    await user.type(inputValor, "2500");

    expect((inputValor as HTMLInputElement).value).toBe("2500");
  });

  test("llama a onGuardar con valor numérico positivo al hacer submit", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(
      <MovimientoForm
        numeroCuenta={numeroCuenta}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const inputValor = screen.getByPlaceholderText(/Valor/i);
    await user.clear(inputValor);
    await user.type(inputValor, "1500");

    await user.click(screen.getByRole("button", { name: /Guardar/i }));

    expect(mockGuardar).toHaveBeenCalledWith(1500);
  });

  test("llama a onGuardar con valor numérico negativo al hacer submit", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(
      <MovimientoForm
        numeroCuenta={numeroCuenta}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const inputValor = screen.getByPlaceholderText(/Valor/i);
    await user.clear(inputValor);
    await user.type(inputValor, "-23");

    await user.click(screen.getByRole("button", { name: /Guardar/i }));

    expect(mockGuardar).toHaveBeenCalledWith(-23);
  });

  test("llama a onCancelar al hacer click en cancelar", async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(
      <MovimientoForm
        numeroCuenta={numeroCuenta}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(mockCancelar).toHaveBeenCalled();
  });
});
