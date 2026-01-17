import { useParams } from "react-router-dom";
import CuentaList from "../components/CuentaList";

export default function CuentaPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  if (!clienteId) return <p>ID de cliente no proporcionado</p>;
  return <CuentaList clienteId={Number(clienteId)} />;
}