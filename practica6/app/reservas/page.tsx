import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonesEstadoReserva } from "./botones-estado";
import { tarjeta } from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
  pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-gray-100 text-gray-500 border-gray-200",
};

// Next.js pasa searchParams a las páginas automáticamente
export default async function PaginaReservas({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams; // Esperamos los parámetros (Next 15+)

  // Si hay estado en la URL, lo usamos como filtro. Si no, traemos todas.
  const filtro = estado ? { estado } : {};

  const reservas = await prisma.reserva.findMany({
    where: filtro,
    orderBy: { fecha: "asc" },
    include: { servicio: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Reservas</h1>
        <Link href="/reservas/nueva" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
          Nueva reserva
        </Link>
      </div>

      {/* Enlaces de filtro */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <Link href="/reservas" className={`text-sm ${!estado ? 'font-bold' : 'text-gray-500'}`}>Todas</Link>
        <Link href="/reservas?estado=pendiente" className={`text-sm ${estado === 'pendiente' ? 'font-bold' : 'text-gray-500'}`}>Pendientes</Link>
        <Link href="/reservas?estado=confirmada" className={`text-sm ${estado === 'confirmada' ? 'font-bold' : 'text-gray-500'}`}>Confirmadas</Link>
        <Link href="/reservas?estado=cancelada" className={`text-sm ${estado === 'cancelada' ? 'font-bold' : 'text-gray-500'}`}>Canceladas</Link>
      </div>

      {reservas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay reservas para este filtro.</p>
      ) : (
        <ul className="space-y-3">
          {reservas.map((reserva) => (
            <li key={reserva.id} className={`${tarjeta} flex items-start justify-between`}>
              <div>
                <p className="font-medium text-sm">{reserva.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {reserva.servicio.nombre} - {new Date(reserva.fecha).toLocaleString("es-SV")}
                </p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${etiquetaEstado[reserva.estado]}`}>
                  {reserva.estado}
                </span>
              </div>
              {/* Usamos el nuevo componente */}
              <BotonesEstadoReserva id={reserva.id} estadoActual={reserva.estado} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}