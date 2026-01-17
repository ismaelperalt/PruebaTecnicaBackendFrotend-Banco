import { useState } from "react";

interface Props {
  numeroCuenta: string;
  onGuardar: (valor: number) => void;
  onCancelar: () => void;
}

export default function MovimientoForm({
  numeroCuenta,
  onGuardar,
  onCancelar,
}: Props) {
  const [valor, setValor] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(valor);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Nuevo Movimiento</h3>

      <input
        type="text"
        value={numeroCuenta}
        disabled
      />

      <input
        type="number"
        placeholder="Valor (+ depósito / - retiro)"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        required
      />

      <div style={styles.actions}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
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
    gap: 10,
    width: 300,
  },
  actions: {
    display: "flex",
    gap: 10,
  },
};
