import { Request, Response } from "express";
import { mercadoPagoClient } from "../../config/mercadopago.js";
import { Payment } from "mercadopago";
import { orm } from "../../shared/db/orm.js";
import { Alquiler } from "../alquiler/alquiler.entity.js";
import { envioMailPropietarioAvisoCorreo } from "../correo/correo.controller.js";
import { EntityManager } from "@mikro-orm/core";

async function mercadoPagoWebhook(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
    console.log("Id:", req.body.data.id);
    console.log("Notificación de Mercado Pago:", req.body);

    if (req.body.type === "payment") {
      const paymentId = req.body.data.id;
      console.log(`Buscando pago con ID: ${paymentId}`);

      const existingAlquiler = await em.findOne(Alquiler, { paymentId });
      if (existingAlquiler) {
        console.log(
          `Pago ${paymentId} ya fue procesado. Alquiler ID: ${existingAlquiler.id}`
        );
        return res.status(409).json({ error: "El pago ya fue procesado" });
      }

      const paymentClient = new Payment(mercadoPagoClient);
      const payment = await paymentClient.get({ id: paymentId });
      console.log("Pago recibido:", payment);

      if (!payment) {
        console.error(`No se encontró el pago con ID: ${paymentId}`);
        return res.status(404).json({ error: "Pago no encontrado" });
      }

      if (payment.status === "approved") {
        console.log("Pago aprobado. Actualizando base de datos.");

        let rentalData;
        let alquilerId;
        if (payment.metadata && payment.metadata.rental_data) {
          try {
            rentalData = JSON.parse(payment.metadata.rental_data);
          } catch (err) {
            console.error("Error al parsear rental_data en metadata", err);
          }
        }
        if (rentalData) {
          if (rentalData.idAlquiler) {
            alquilerId = rentalData.idAlquiler;
            const alquiler = await em.findOne(Alquiler, { id: alquilerId });
            if (alquiler) {
              alquiler.estadoAlquiler = "CONFIRMADO";
              alquiler.paymentId = paymentId;
              alquiler.fechaPago = new Date(payment.date_approved!);
              await actualizarYNotificarAlquiler(alquiler, em);
              console.log("Alquiler actualizado correctamente.");
            } else {
              console.log("No se encontro el alquiler");
            }
          } else {
            console.log("Crear Alquiler");
            const nuevoAlquiler = {
              locatario: rentalData.locatario,
              vehiculo: rentalData.vehiculo,
              fechaAlquiler: new Date(),
              fechaHoraInicioAlquiler: rentalData.fechaHoraInicioAlquiler,
              fechaHoraDevolucion: rentalData.fechaHoraDevolucion,
              estadoAlquiler: "CONFIRMADO",
              fechaPago: new Date(payment.date_approved!),
              paymentId: paymentId,
            };
            const nuevo = em.create(Alquiler, nuevoAlquiler);
            await actualizarYNotificarAlquiler(nuevo, em);
            console.log("Alquiler creado correctamente.");
          }
        } else {
          console.error("No se encontró rental_data en metadata");
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
}

async function actualizarYNotificarAlquiler(
  alquiler: Alquiler,
  em: EntityManager
) {
  await em.flush();
  await em.populate(alquiler, [
    "locatario",
    "vehiculo",
    "vehiculo.propietario",
  ]);
  await envioMailPropietarioAvisoCorreo(alquiler);
}

export { mercadoPagoWebhook };
