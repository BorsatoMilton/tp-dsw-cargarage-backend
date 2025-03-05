import { Request, Response, NextFunction } from 'express'
import { Alquiler } from './alquiler.entity.js'
import { orm } from '../../shared/db/orm.js'
import { confirmRentMail, envioMailPropietarioAvisoCorreo } from '../correo/correo.controller.js'

const em = orm.em

function sanitizeAlquilerInput(req: Request, res: Response, next: NextFunction) {
  try {
      const fechaAlquiler = new Date();
      const fechaInicio = new Date(req.body.fechaHoraInicioAlquiler);
      const fechaDevolucion = new Date(req.body.fechaHoraDevolucion);

      if (isNaN(fechaInicio.getTime())) throw new Error('Fecha de inicio inválida');
      if (isNaN(fechaDevolucion.getTime())) throw new Error('Fecha de devolución inválida');

      if (fechaInicio.getTime() < fechaAlquiler.getTime()) throw new Error('La fecha de inicio no puede ser menor a la fecha actual');
      if (fechaDevolucion.getTime() < fechaInicio.getTime()) throw new Error('La fecha de devolución no puede ser menor a la fecha de inicio');

      req.body.sanitizedInput = {
          fechaAlquiler: fechaAlquiler,
          fechaHoraInicioAlquiler: fechaInicio,
          fechaHoraDevolucion: fechaDevolucion,
          estadoAlquiler: req.body.estadoAlquiler,
          locatario: req.body.locatario,
          vehiculo: req.body.vehiculo,
          tiempoConfirmacion: calcularFechaLimite(fechaAlquiler, fechaInicio),
          fechaPago: null,
          paymentId: null
      };
      next();
  } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Error en fechas' });
  }
}

function calcularFechaLimite(fechaAlquiler: Date, fechaInicio: Date): Date | null {
  const tiempoEntreFechas = fechaInicio.getTime() - fechaAlquiler.getTime();
  return tiempoEntreFechas > 0 ? new Date(fechaAlquiler.getTime() + tiempoEntreFechas * 0.7) : null;
}

async function findAll(req: Request, res: Response) {
  try {
    const alquileres = await em.find(Alquiler, {}, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario'] });
    res.status(200).json(alquileres);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los alquileres', error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    em.clear()
    const id = req.params.id;
    const alquiler = await em.findOne(Alquiler, { id }, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario'] });
    if(!alquiler){
      return res.status(200).json(null);
    }
    res.status(200).json(alquiler);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el Alquiler', error: error.message });
  }
}

async function getOneById(idAlquiler: string) {
  try {
    const alquiler = await em.findOneOrFail(Alquiler, { id: idAlquiler }, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario', 'vehiculo.marca'] });
    return alquiler;
  } catch (error: any) {
    return null;
  }
}

async function findAllByVehicle(req: Request, res: Response) {
  try {
    const idVehiculo = req.params.id;
    const alquileres = await em.find(Alquiler, { vehiculo: idVehiculo }, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario'] });
    res.status(200).json(alquileres);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los alquileres por vehículo', error: error.message });
  }
}

async function findAllByUser(req: Request, res: Response) {
  try {
    const idUsuario = req.params.id;
    const alquileres = await em.find(Alquiler, { locatario: idUsuario }, { populate: ['locatario', 'vehiculo', 'vehiculo.propietario'] });
    res.status(200).json(alquileres);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los alquileres por usuario', error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const alquilerACrear = {
      ...req.body.sanitizedInput,
      fechaPago: null,
    }
    const alquiler = em.create(Alquiler, alquilerACrear);
    await em.flush();
    res.status(201).json(alquiler);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el alquiler', error: error.message });
  }
}

async function confirmarAlquilerMail(req: Request, res: Response) {
  try {
    const usuario = req.body; 
    const id = req.params.id;
    
    const alquiler = await em.findOne(
      Alquiler, 
      { id }, 
      { populate: ['vehiculo', 'vehiculo.marca'] }
    );
    
    if (!alquiler) {
      return res.status(404).json({ message: 'Alquiler no encontrado' });
    }

    const correoResultado = await confirmRentMail(usuario, alquiler);

    if (!correoResultado.ok) {
      return res.status(500).json(correoResultado);
    }
    
    res.status(201).json({ ok: true, message: 'Alquiler confirmado' });
  } catch (error: any) {
    console.error('Error en confirmRent:', error); 
    res.status(500).json({ 
      message: 'Error al confirmar el alquiler',
      error: error.message 
    });
  }
}

async function confirmRent(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const alquiler = em.getReference(Alquiler, id);
    alquiler.estadoAlquiler = 'CONFIRMADO';
    await em.flush();
    envioMailPropietarioAviso(id)
    res.status(200).json({ message: 'Alquiler Confirmado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al confirmar el alquiler', error: error.message });
  }
}

async function cancelRent(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const alquiler = em.getReference(Alquiler, id);
    alquiler.estadoAlquiler = 'CANCELADO';
    await em.flush();
    res.status(200).json({ message: 'Alquiler Cancelado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al cancelar el alquiler', error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const alquiler = em.getReference(Alquiler, id);
    if (!alquiler) {
      return res.status(404).json({ message: 'Alquiler no encontrado' });
    }
    await em.removeAndFlush(alquiler);
    res.status(200).json({ message: 'Alquiler eliminado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar el alquiler', error: error.message });
  }
}


async function envioMailPropietarioAviso(id:string){
  try{
    const alquiler = await em.findOne(Alquiler, {id:id}, {populate: ['locatario', 'vehiculo', 'vehiculo.propietario']})
    if(!alquiler){
      throw new Error("No se encuentra el alquiler")
    }
    await envioMailPropietarioAvisoCorreo(alquiler)

  }catch(error: any){
    console.error(error.message)
  }
  



}
export { sanitizeAlquilerInput, findAll, findAllByVehicle, findAllByUser, findOne, getOneById, add, remove,confirmRent, confirmarAlquilerMail, cancelRent }