// src/components/ClienteForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClienteForm from './ClienteForm';
import { vi } from 'vitest';

describe('ClienteForm', () => {
  test('renderiza inputs y botones', () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(<ClienteForm onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/identificación/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /activo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('permite escribir en inputs y cambiar checkbox', async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<ClienteForm onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.type(screen.getByPlaceholderText(/nombre/i), 'Ismael');
    await user.type(screen.getByPlaceholderText(/identificación/i), '0987654321');
    await user.type(screen.getByPlaceholderText(/teléfono/i), '0998887777');
    await user.type(screen.getByPlaceholderText(/dirección/i), 'Calle Falsa 456');

    const checkbox = screen.getByRole('checkbox', { name: /activo/i });
    await user.click(checkbox);

    expect((screen.getByPlaceholderText(/nombre/i) as HTMLInputElement).value).toBe('Ismael');
    expect((screen.getByPlaceholderText(/identificación/i) as HTMLInputElement).value).toBe('0987654321');
    expect((screen.getByPlaceholderText(/teléfono/i) as HTMLInputElement).value).toBe('0998887777');
    expect((screen.getByPlaceholderText(/dirección/i) as HTMLInputElement).value).toBe('Calle Falsa 456');
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });

  test('llama a onGuardar al hacer submit', async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<ClienteForm onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.type(screen.getByPlaceholderText(/nombre/i), 'Ismael');
    await user.type(screen.getByPlaceholderText(/identificación/i), '0987654321');

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(mockGuardar).toHaveBeenCalledTimes(1);
    expect(mockGuardar.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        nombre: 'Ismael',
        identificacion: '0987654321',
      })
    );
  });

  test('llama a onCancelar al hacer clic en cancelar', async () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();
    const user = userEvent.setup();

    render(<ClienteForm onGuardar={mockGuardar} onCancelar={mockCancelar} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockCancelar).toHaveBeenCalledTimes(1);
  });
});
