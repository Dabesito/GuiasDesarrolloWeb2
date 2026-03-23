"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const EsquemaReserva = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("El correo no es válido."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  servicioId: z.coerce
    .number({ error: () => ({ message: "Debe seleccionar un servicio." }) })
    .int()
    .positive("Debe seleccionar un servicio."),
});

export async function crearReserva(_estadoPrevio: any, formData: FormData) {
  const campos = EsquemaReserva.safeParse({
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    fecha: formData.get("fecha"),
    servicioId: formData.get("servicioId"),
  });

  if (!campos.success) {
    return {
      errores: campos.error.flatten().fieldErrors,
      mensaje: "Error de validación.",
    };
  }



  const servicio = await prisma.servicio.findUnique({
    where: { id: campos.data.servicioId }
  });

  if (!servicio) {
    return { errores: {}, mensaje: "Servicio no encontrado." };
  }

  const nuevaInicio = new Date(campos.data.fecha);
  const nuevaFin = new Date(nuevaInicio.getTime() + servicio.duracion * 60000); 

 
  const reservasExistentes = await prisma.reserva.findMany({
    where: { 
      servicioId: campos.data.servicioId,
      estado: { not: "cancelada" }
    }
  });


  const hayConflicto = reservasExistentes.some((reserva) => {
    const resInicio = reserva.fecha;
    const resFin = new Date(resInicio.getTime() + servicio.duracion * 60000);
    

    return nuevaInicio < resFin && nuevaFin > resInicio;
  });

  if (hayConflicto) {
    return { 
      errores: {}, 
      mensaje: "Ese horario no está disponible porque choca con otra reserva." 
    };
  }

  await prisma.reserva.create({
    data: {
      nombre: campos.data.nombre,
      correo: campos.data.correo,
      fecha: nuevaInicio,
      servicioId: campos.data.servicioId,
    },
  });

  revalidatePath("/reservas");
  redirect("/reservas");
}


export async function cancelarReserva(id: number) {
  try {
    await prisma.reserva.update({ 
      where: { id },
      data: { estado: "cancelada" } 
    });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo cancelar la reserva." };
  }
}

export async function confirmarReserva(id: number) {
  try {
    await prisma.reserva.update({ 
      where: { id },
      data: { estado: "confirmada" } 
    });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo confirmar la reserva." };
  }
}