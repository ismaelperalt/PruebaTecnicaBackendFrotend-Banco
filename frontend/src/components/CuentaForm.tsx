import { useState } from "react";
import type { Cuenta } from "../model/Cuenta";

interface Props {
  cuenta?: Cuenta;
  onGuardar: (cuenta: Cuenta) => void;
  onCancelar: () => void;
  clienteId: number;
}

export default function CuentaForm({ cuenta, onGuardar, onCancelar, clienteId }: Props) {
  const [form, setForm] = useState<Cuenta>({
    id: cuenta?.id,
    numeroCuenta: cuenta?.numeroCuenta ?? "",
    tipoCuenta: cuenta?.tipoCuenta ?? "",
    saldoInicial: cuenta?.saldoInicial ?? 0,
    estado: cuenta?.estado ?? true,
    clienteId: cuenta?.clienteId ?? clienteId,
    clienteNombre: cuenta?.clienteNombre ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === "saldoInicial") {
      // Permitimos solo números y punto
      const cleanedValue = value.replace(/[^0-9.]/g, "");
      newValue = cleanedValue;
    } else {
      newValue = value;
    }

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertimos saldoInicial a número antes de enviar
    const formToSave = {
      ...form,
      saldoInicial: Number(form.saldoInicial),
    };

    onGuardar(formToSave);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{cuenta ? "Editar Cuenta" : "Nueva Cuenta"}</h3>

      <input
        name="numeroCuenta"
        placeholder="Número de Cuenta"
        value={form.numeroCuenta}
        onChange={handleChange}
        required
      />

      <select name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} required>
        <option value="">Selecciona tipo</option>
        <option value="AHORRO">Ahorro</option>
        <option value="CORRIENTE">Corriente</option>
      </select>

      <input
        type="text"
        name="saldoInicial"
        placeholder="Saldo inicial"
        value={form.saldoInicial}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="estado"
          checked={form.estado}
          onChange={handleChange}
        />
        Activa
      </label>

      <div style={styles.actions}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    border: "1px solid #ccc",
    padding: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: 300,
  },
  actions: {
    display: "flex",
    gap: 10,
  },
};
