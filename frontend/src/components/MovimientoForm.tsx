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
  const [valorStr, setValorStr] = useState<string>("0"); // Guardamos como string

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = Number(valorStr); // Convertimos solo al enviar
    if (isNaN(valorNum)) {
      alert("Ingresa un número válido");
      return;
    }
    onGuardar(valorNum);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Nuevo Movimiento</h3>

      <input type="text" value={numeroCuenta} disabled />

      <input
        type="text"
        placeholder="Valor (+ depósito / - retiro)"
        value={valorStr}
        onChange={(e) => setValorStr(e.target.value)}
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
