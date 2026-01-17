import { useState } from "react";
import type { Cliente } from "../model/Cliente";


interface Props {
  cliente?: Cliente;
  onGuardar: (cliente: Cliente) => void;
  onCancelar: () => void;
}

export default function ClienteForm({ cliente, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<Cliente>({
    id: cliente?.id,
    nombre: cliente?.nombre ?? "",
    identificacion: cliente?.identificacion ?? "",
    telefono: cliente?.telefono ?? "",
    direccion: cliente?.direccion ?? "",
    estado: cliente?.estado ?? true,
  });

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };


  

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>

      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <input
        name="identificacion"
        placeholder="Identificación"
        value={form.identificacion}
        onChange={handleChange}
        required
      />

      <input
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />

      <input
        name="direccion"
        placeholder="Dirección"
        value={form.direccion}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="estado"
          checked={form.estado}
          onChange={handleChange}
        />
        Activo
      </label>

      <div style={styles.actions}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

/* 👇 CLAVE: tipamos los estilos */
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
