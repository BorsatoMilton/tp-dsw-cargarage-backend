import cron from "node-cron";
import { Alquiler } from "../components/alquiler/alquiler.entity.js";
import { orm } from "../shared/db/orm.js";
import { avisoPuntuarAlquiler, avisoPuntuarCompra, envioAvisoParaConfirmarAlquiler } from "../components/correo/correo.controller.js";
import { Compra } from "../components/compra/compra.entity.js";
import { Vehiculo } from "../components/vehiculo/vehiculo.entity.js";
import { remove } from "../components/vehiculo/vehiculo.controler.js";


cron.schedule("*/30 * * * *", async () => {
  console.log("Revisando estados de alquiler...");

  const ahora = new Date();
  const em = orm.em.fork();

  try {
    const alquileresReservadosSinConfirmar = await em.find(Alquiler, {
      estadoAlquiler: "RESERVADO",
      tiempoConfirmacion: { $lt: ahora },
    });

    const alquileresReservados = await em.find(Alquiler, {
      estadoAlquiler: "RESERVADO",
      tiempoConfirmacion: { $lt: new Date(ahora.getTime() + 12 * 60 * 60 * 1000) },
    }, {populate: ['locatario', 'vehiculo', 'vehiculo.marca']});

    const alquileresNoConfirmadosAborrar = await em.find(Alquiler, {
      estadoAlquiler: "NO CONFIRMADO",
    });

    const alquileresEnCurso = await em.find(Alquiler, {
      estadoAlquiler: "CONFIRMADO",
      fechaHoraInicioAlquiler: { $lt: ahora },
    });

    const alquileresFinalizados = await em.find(Alquiler, {
      estadoAlquiler: "EN CURSO",
      fechaHoraDevolucion: { $lt: ahora },
    }, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario', 'vehiculo.marca'] });

    const comprasSinConfirmar = await em.find(Compra, {
      estadoCompra: "PENDIENTE",
      fechaLimiteConfirmacion: { $lt: ahora },
    });

    const comprasSinConfirmarABorrar = await em.find(Compra, {
      estadoCompra: "NO CONFIRMADA",
      fechaLimiteConfirmacion: { $lt: ahora },
    })

    const comprasCanceladas = await em.find(Compra, {
      estadoCompra: "CANCELADA",
    })

    const comprasFinalizadas = await em.find(Compra, {
      estadoCompra: "CONFIRMADA",}, { populate: ['usuario', 'vehiculo', 'vehiculo.propietario', 'vehiculo.marca']
    })

    const vehiculosDadosDeBaja = await em.find(Vehiculo, {
      fechaBaja: { $ne: null },
    })
    
    if (alquileresReservadosSinConfirmar.length > 0) {
      console.log(
        `${alquileresReservadosSinConfirmar.length} alquiler(es) no fueron confirmados a tiempo.`
      );
      for (const alquiler of alquileresReservadosSinConfirmar) {
        alquiler.estadoAlquiler = "NO CONFIRMADO";
      }
    }

    if(alquileresReservados.length > 0) {
      console.log(
        `${alquileresReservados.length} alquiler(es) están próximos a quedarse sin confirmar.`
      );
      for (const alquiler of alquileresReservados) {
        await envioAvisoParaConfirmarAlquiler(alquiler.locatario, alquiler);
      }
    }
    
    if (alquileresNoConfirmadosAborrar.length > 0) {
      for (const alquiler of alquileresNoConfirmadosAborrar) {
        if (alquiler.tiempoConfirmacion) {
          const diferenciaTiempo = Date.now() - new Date(alquiler.tiempoConfirmacion).getTime();
          const sieteDiasEnMs = 7 * 24 * 60 * 60 * 1000;
          if (diferenciaTiempo >= sieteDiasEnMs) {
            await em.removeAndFlush(alquiler);
          }
        }
      }
    }
    
    if (alquileresEnCurso.length > 0) {
      console.log(
        `${alquileresEnCurso.length} alquiler(es) han comenzado y están en curso.`
      );
      for (const alquiler of alquileresEnCurso) {
        alquiler.estadoAlquiler = "EN CURSO";
      }
    }

    if (alquileresFinalizados.length > 0) {
      console.log(
        `${alquileresFinalizados.length} alquiler(es) han sido finalizados.`
      );
      for (const alquiler of alquileresFinalizados) {
        alquiler.estadoAlquiler = "FINALIZADO";
        await avisoPuntuarAlquiler(alquiler.locatario.id, alquiler.vehiculo.propietario.id ,alquiler);
      }
    }

    if (comprasSinConfirmar.length > 0) {
      console.log(`${comprasSinConfirmar.length} compra(as) han quedado sin confirmar.`)
      for (const compra of comprasSinConfirmar) {
        compra.estadoCompra = "NO CONFIRMADA";
      }
    }

    if (comprasSinConfirmarABorrar.length > 0) {
      for (const compra of comprasSinConfirmarABorrar) {
        const diferenciaTiempo = Date.now() - new Date(compra.fechaLimiteConfirmacion).getTime();
        const sieteDiasEnMs = 7 * 24 * 60 * 60 * 1000;
        if (diferenciaTiempo >= sieteDiasEnMs) {
          await em.removeAndFlush(compra);
        }
      }
    }

    if (comprasCanceladas.length > 0) {
      console.log(`${comprasCanceladas.length} compra(as) canceladas fueron borradas`)
      for (const compra of comprasCanceladas) {
        const diferenciaTiempo = Date.now() - new Date(compra.fechaCancelacion).getTime();
        const sieteDiasEnMs = 7 * 24 * 60 * 60 * 1000;
        if (diferenciaTiempo >= sieteDiasEnMs) {
          await em.removeAndFlush(compra);
        }
      }
    }

    if (comprasFinalizadas.length > 0) {
      console.log(`${comprasFinalizadas.length} compra(as) finalizadas`)
      for (const compra of comprasFinalizadas) {
          console.log('Compra finalizada', compra.usuario, compra.vehiculo.propietario)
          await avisoPuntuarCompra(compra.usuario.id, compra.vehiculo.propietario.id ,compra);
          compra.estadoCompra = 'FINALIZADA'
        }
    }

    if (vehiculosDadosDeBaja.length > 0) {
      const treintaDiasEnMs = 30 * 24 * 60 * 60 * 1000;
      for (const vehiculo of vehiculosDadosDeBaja) {
        if (vehiculo.fechaBaja) { 
          const diferenciaTiempo = Date.now() - new Date(vehiculo.fechaBaja).getTime();
          if (diferenciaTiempo >= treintaDiasEnMs) {
            await remove(vehiculo.id);
          }
        }
      }
    }
    
    
      
    await em.flush();
    console.log("Estados de alquiler actualizados correctamente.");
  } catch (error) {
    console.error("Error actualizando estados de alquiler:", error);
  }
});
