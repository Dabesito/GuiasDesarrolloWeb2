"use client";
import { cancelarReserva, confirmarReserva } from "@/app/actions/reservas";
import { botonPeligro } from "@/app/lib/estilos";

export function BotonesEstadoReserva({
  id,
  estadoActual,
}: {
  id: number;
  estadoActual: string;
}) {
  if (estadoActual === "cancelada") {
    return (
      <span className="text-xs text-gray-400 ml-4 shrink-0">Cancelada</span>
    );
  }

  return (
    <div className="flex gap-3 ml-4 shrink-0">
      {estadoActual === "pendiente" && (
        <button
          onClick={() => confirmarReserva(id)}
          className="text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          Confirmar
        </button>
      )}
      <button onClick={() => cancelarReserva(id)} className={botonPeligro}>
        Cancelar
      </button>
    </div>
  );
}
