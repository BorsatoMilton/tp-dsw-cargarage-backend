import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Alquiler } from '../alquiler/alquiler.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';
import { Compra } from '../compra/compra.entity.js';

dotenv.config();

async function recuperarContraseña(token: string, user: Usuario): Promise<{ok: boolean, message: string, info?: string}> {

    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;


    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de contraseña</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #d9534f; text-align: center; }
            p { font-size: 16px; line-height: 1.5; }
            .button { display: block; width: 100%; text-align: center; margin-top: 20px; }
            .button a { background-color: #007bff; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Recuperación de contraseña</h2>
            <p>Hola <strong>${user.nombre}</strong>,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Para continuar con el proceso, haz clic en el siguiente botón:</p>
            <div class="button">
                <a href="${resetLink}">Restablecer contraseña</a>
            </div>
            <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        </div>
    </body>
    </html>
    `;

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'Recuperación de contraseña',
        to: user.mail,
        html: htmlContent 
    };

    try {
        const info = await config.sendMail(opciones);
        return {
            ok: true,
            message: 'Correo enviado correctamente',
            info: info.response
        };
    } catch (error: any) {
        return {
            ok: false,
            message: 'Error al enviar el correo',
            info: error.message
        };
    }
};

async function avisoCompraExitosaMail(user: Usuario, vehiculo: Vehiculo): Promise<{ ok: boolean; message: string; info?: string }> {
    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compra Exitosa</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #007bff; text-align: center; }
            p { font-size: 16px; line-height: 1.5; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>¡Compra Exitosa!</h2>
            <p>Hola <strong>${user.nombre}</strong>,</p>
            <p>Queremos informarte que tu compra se ha realizado con éxito. En breve, el propietario se pondra en contacto contigo para coordinar la forma de pago y la entrega.</p>
            <p>Si tienes alguna consulta, no dudes en comunicarte con nuestro equipo de soporte.</p>
        </div>
    </body>
    </html>
    `;

    const htmlContentPropietario = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vehículo Vendido</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background-color: #f8f9fa; 
                color: #333; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: #fff; 
                padding: 20px; 
                border-radius: 8px; 
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
            }
            h2 { 
                color: #28a745;
                text-align: center; 
            }
            p { 
                font-size: 16px; 
                line-height: 1.5; 
            }
            .details { 
                margin-top: 20px; 
                padding: 15px; 
                background-color: #f1f1f1; 
                border-radius: 5px; 
            }
            .details strong { 
                color: #007bff; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>¡Tu vehículo ha sido vendido!</h2>
            <p>Hola <strong>${vehiculo.propietario.nombre}</strong>,</p>
            <p>Nos complace informarte que tu vehículo ha sido vendido exitosamente. A continuación, te proporcionamos los detalles de la transacción:</p>
            
            <div class="details">
                <p><strong>Vehículo:</strong> ${vehiculo.marca.nombreMarca} ${vehiculo.modelo} (${vehiculo.anio})</p>
                <p><strong>Comprador:</strong> ${user.nombre} ${user.apellido}</p>
                <p><strong>Contacto: </strong> ${user.mail} || ${user.telefono}</p>
                <p><strong>Precio de venta:</strong> $${vehiculo.precioVenta}</p>
            </div>
    
            <p>Por favor, ponte en contacto con el comprador para coordinar la entrega y forma de pago del vehículo. Si necesitas asistencia, no dudes en contactar a nuestro equipo de soporte.</p>
            <p>¡Gracias por confiar en nosotros!</p>
        </div> 
    </body>
    </html>
    `;

    const opcionesPropietario = {
        from: process.env.EMAIL_USER,
        subject: 'Vehículo Vendido',
        to: vehiculo.propietario.mail,
        html: htmlContentPropietario,
    };

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'Compra Exitosa',
        to: user.mail,
        html: htmlContent,
    };

    try {
        const infoComprador = await config.sendMail(opciones);

        const infoPropietario = await config.sendMail(opcionesPropietario);

        return {
            ok: true,
            message: 'Correos enviados correctamente',
            info: `Comprador: ${infoComprador.response}, Propietario: ${infoPropietario.response}`,
        };
    } catch (error: any) {
        console.error('Error al enviar correos:', error);

        if (error.response && error.response.includes(user.mail)) {
            return {
                ok: false,
                message: 'Error al enviar el correo al comprador',
                info: error.message,
            };
        } else if (error.response && error.response.includes(vehiculo.propietario.mail)) {
            return {
                ok: false,
                message: 'Error al enviar el correo al propietario',
                info: error.message,
            };
        } else {
            return {
                ok: false,
                message: 'Error al enviar los correos',
                info: error.message,
            };
        }
    }
}

async function confirmarCompraMailCorreo(compra: Compra): Promise<{ok: boolean, message: string, info?: string}> {

    const confirmLink = `${process.env.CLIENT_URL}/product/confirm-purchase?id=${compra.id}`;

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de compra</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #007bff; text-align: center; }
            p { font-size: 16px; line-height: 1.5; }
            .button { display: block; width: fit-content; margin: 20px auto; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Confirmación de compra</h2>
            <p>Hola <strong>${compra.usuario.nombre}</strong>,</p>
            <p>Para confirmar la compra del vehículo <strong>${compra.vehiculo.marca.nombreMarca} ${compra.vehiculo.modelo}</strong>, haz clic en el siguiente enlace:</p>
            <a href="${confirmLink}" class="button">Confirmar compra</a>
            <p>Si no realizaste esta solicitud, ignora este mensaje.</p>
        </div>
    </body>
    </html>
    `;

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'Confirmación de compra',
        to: compra.usuario.mail,
        html: htmlContent 
    };

    try {
        const info = await config.sendMail(opciones);
        return {
            ok: true,
            message: 'Correo enviado correctamente',
            info: info.response
        };
    } catch (error: any) {
        return {
            ok: false,
            message: 'Error al enviar el correo',
            info: error.message
        };
    }
}

async function confirmRentMail(destinatario: Usuario, alquiler: Alquiler):  Promise<{ok: boolean, message: string, info?: string}> {
    const confirmLinkRent = `${process.env.CLIENT_URL}/product/confirm-rent?id=${alquiler.id}`;

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    })

    const fechaInicio = new Date(alquiler.fechaHoraInicioAlquiler).getTime();
    const fechaFin = new Date(alquiler.fechaHoraDevolucion).getTime();
    const diasAlquiler = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    const precioDiario = alquiler.vehiculo?.precioAlquilerDiario || 0;
    diasAlquiler > 0 ? diasAlquiler : 1;
    const precioTotal = diasAlquiler * precioDiario;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Confirmación de Alquiler</h2>
                <p style="color: #555;">Hola,</p>
                <p style="color: #555;">Has solicitado un alquiler y necesitamos que confirmes la operación.</p>
                <p style="color: #555;">Detalles del alquiler:</p>
                <ul style="text-align: left; color: #555; padding-left: 20px;">
                    <li><strong>Vehículo:</strong> ${alquiler.vehiculo?.marca.nombreMarca || 'N/A'} ${alquiler.vehiculo?.modelo || ''}</li>
                    <li><strong>Fecha de inicio:</strong> ${alquiler.fechaHoraInicioAlquiler}</li>
                    <li><strong>Fecha de devolución:</strong> ${alquiler.fechaHoraDevolucion}</li>
                    <li><strong>Duración:</strong> ${diasAlquiler} día(s)</li>
                    <li><strong>Precio total:</strong> $${precioTotal.toFixed(2)}</li>
                </ul>
                <p style="color: #555;">Para confirmar el alquiler, haz clic en el siguiente botón:</p>
                <a href="${confirmLinkRent}" 
                   style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
                   Confirmar Alquiler
                </a>
                <p style="margin-top: 20px; color: #777;">Si no realizaste esta solicitud, ignora este mensaje.</p>
            </div>
        </div>
    `;

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'Confirmación de Alquiler',
        to: destinatario.mail,
        html: htmlContent
    };

    try {
        const info = await config.sendMail(opciones);
        return {
            ok: true,
            message: 'Correo enviado correctamente',
            info: info.response
        };
    } catch (error: any) {
        return {
            ok: false,
            message: 'Error al enviar el correo',
            info: error.message
        };
    }
}


async function avisoPuntuarAlquiler(locatario: string, locador: string, alquiler: Alquiler) {
    if (!locador || !locatario || !alquiler) {
        console.log('Faltan datos para enviar el correo de calificación');
        return;
    }

    const locatarioLink = `${process.env.CLIENT_URL}/auth/rate/${locador}/${alquiler.id}`;
    const locadorLink = `${process.env.CLIENT_URL}/auth/rate/${locatario}/${alquiler.id}`;

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const generateEmailContent = (nombre: string, apellido: string, link: string) => `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Califica tu experiencia</h2>
                <p style="color: #555;">Hola ${nombre} ${apellido},</p>
                <p style="color: #555;">Tu alquiler ha finalizado. A continuación, te mostramos algunos detalles:</p>
                <ul style="text-align: left; color: #555; padding-left: 20px;">
                    <li><strong>Fecha de reserva:</strong> ${alquiler.fechaAlquiler}</li>
                    <li><strong>Fecha de inicio:</strong> ${alquiler.fechaHoraInicioAlquiler}</li>
                    <li><strong>Fecha de devolución:</strong> ${alquiler.fechaHoraDevolucion}</li>
                    <li><strong>Vehículo:</strong> ${alquiler.vehiculo?.marca.nombreMarca || 'N/A'} ${alquiler.vehiculo?.modelo || ''}</li>
                </ul>
                <p style="color: #555;">Por favor, califica tu experiencia haciendo clic en el siguiente botón:</p>
                <a href="${link}" 
                   style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
                   Calificar ahora
                </a>
                <p style="margin-top: 20px; color: #777;">¡Gracias por usar nuestros servicios!</p>
            </div>
        </div>
    `;

    const opcionesLocatario = {
        from: process.env.EMAIL_USER,
        subject: 'Califica tu experiencia de alquiler',
        to: alquiler.locatario.mail,
        html: generateEmailContent(alquiler.locatario.nombre, alquiler.locatario.apellido, locatarioLink)
    };

    const opcionesLocador = {
        from: process.env.EMAIL_USER,
        subject: 'Califica tu experiencia de alquiler',
        to: alquiler.vehiculo.propietario.mail,
        html: generateEmailContent(alquiler.vehiculo.propietario.nombre, alquiler.vehiculo.propietario.apellido, locadorLink)
    };

    try {
        const [infoLocatario, infoLocador] = await Promise.all([
            config.sendMail(opcionesLocatario),
            config.sendMail(opcionesLocador)
        ]);

        console.log('Correos de calificación enviados correctamente', {
            locatario: infoLocatario.response,
            locador: infoLocador.response
        });
    } catch (error: any) {
        console.error('Error al enviar el correo de calificación', error.message);
    }
}

async function avisoPuntuarCompra(comprador: string, vendedor: string, compra: Compra) {
    if (!vendedor || !comprador || !compra) {
        console.log('Faltan datos para enviar el correo de calificación');
        return;
    }

    const compradorLink = `${process.env.CLIENT_URL}/auth/rate/${vendedor}/${compra.id}`;
    const vendedorLink = `${process.env.CLIENT_URL}/auth/rate/${comprador}/${compra.id}`;

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const generateEmailContent = (nombre: string, apellido: string, link: string) => `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Califica tu experiencia</h2>
                <p style="color: #555;">Hola ${nombre} ${apellido},</p>
                <p style="color: #555;">Tu proceso de compra ha finalizado. A continuación, te mostramos algunos detalles:</p>
                <ul style="text-align: left; color: #555; padding-left: 20px;">
                    <li><strong>Fecha de compra:</strong> ${compra.fechaCompra}</li>
                    <li><strong>Vehiculo:</strong>${compra.vehiculo.marca.nombreMarca} ${compra.vehiculo.modelo}  ${compra.vehiculo.anio}</</li>
                    <li><strong>Precio: </strong> ${compra.vehiculo.precioVenta}</li>
                </ul>
                <p style="color: #555;">Por favor, califica tu experiencia haciendo clic en el siguiente botón:</p>
                <a href="${link}" 
                   style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
                   Calificar ahora
                </a>
                <p style="margin-top: 20px; color: #777;">¡Gracias por usar nuestros servicios!</p>
            </div>
        </div>
    `;

    const opcionesVendedor = {
        from: process.env.EMAIL_USER,
        subject: 'Califica tu experiencia de compra',
        to: compra.vehiculo.propietario.mail,
        html: generateEmailContent(compra.vehiculo.propietario.nombre, compra.vehiculo.propietario.apellido, vendedorLink)
    };

    const opcionesComprador = {
        from: process.env.EMAIL_USER,
        subject: 'Califica tu experiencia de compra',
        to: compra.usuario.mail,
        html: generateEmailContent(compra.usuario.nombre, compra.usuario.apellido, compradorLink)
    };

    try {
        const [infoComprador, infoVendedor] = await Promise.all([
            config.sendMail(opcionesVendedor),
            config.sendMail(opcionesComprador)
        ]);

        console.log('Correos de calificación enviados correctamente', {
            comprador: infoComprador.response,
            vendedor: infoVendedor.response
        });
    } catch (error: any) {
        console.error('Error al enviar el correo de calificación', error.message);
    }
}


async function envioMailPropietarioAvisoCorreo(alquiler: Alquiler){

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Nuevo Alquiler</h2>
                <p style="color: #555;">Hola, ${alquiler.vehiculo.propietario.nombre}</p>
                <p style="color: #555;">Te informamos que tu vehiculo ${alquiler.vehiculo.modelo} ${alquiler.vehiculo.anio} se ha alquilado.</p>
                <p style="color: #555;">Detalles del alquiler:</p>
                <ul style="text-align: left; color: #555; padding-left: 20px;">
                    <li><strong>Locatario:</strong> ${alquiler.locatario.nombre} ${alquiler.locatario.apellido}</li>
                    <li><strong>Contacto:</strong> ${alquiler.locatario.mail} | ${alquiler.locatario.telefono}</li>
                    <li><strong>Fecha de inicio:</strong> ${alquiler.fechaHoraInicioAlquiler}</li>
                    <li><strong>Fecha de devolución:</strong> ${alquiler.fechaHoraDevolucion}</li>
                </ul>
            </div>
        </div>
    `;

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'Nuevo Alquiler',
        to: alquiler.vehiculo.propietario.mail,
        html: htmlContent
    };
    try {
        config.sendMail(opciones)
    } catch (error: any) {
        console.error('Error al enviar el correo de aviso de alquiler', error.message);
    }
}

async function envioAvisoParaConfirmarAlquiler(destinatario: Usuario, alquiler: Alquiler): Promise<{ok: boolean, message: string, info?: string}> {
    const confirmLinkRent = `${process.env.CLIENT_URL}/product/confirm-rent?id=${alquiler.id}`;


    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const fechaInicio = new Date(alquiler.fechaHoraInicioAlquiler).getTime();
    const fechaFin = new Date(alquiler.fechaHoraDevolucion).getTime();
    const diasAlquiler = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    const precioDiario = alquiler.vehiculo?.precioAlquilerDiario || 0;
    diasAlquiler > 0 ? diasAlquiler : 1;
    const precioTotal = diasAlquiler * precioDiario;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Confirmación de Alquiler</h2>
                <p style="color: #555;">Hola, ${destinatario.nombre}</p>
                <p style="color: #555;">Has solicitado un alquiler recientemente y quedan 12 horas restantes para que confirmes la operación.</p>
                <p style="color: #555;">Detalles del alquiler:</p>
                <ul style="text-align: left; color: #555; padding-left: 20px;">
                    <li><strong>Vehículo:</strong> ${alquiler.vehiculo?.marca.nombreMarca || 'N/A'} ${alquiler.vehiculo?.modelo || ''}</li>
                    <li><strong>Fecha de inicio:</strong> ${alquiler.fechaHoraInicioAlquiler}</li>
                    <li><strong>Fecha de devolución:</strong> ${alquiler.fechaHoraDevolucion}</li>
                    <li><strong>Duración:</strong> ${diasAlquiler} día(s)</li>
                    <li><strong>Precio total:</strong> $${precioTotal.toFixed(2)}</li>
                </ul>
                <p style="color: #555;">Para confirmar el alquiler, haz clic en el siguiente botón:</p>
                <a href="${confirmLinkRent}" 
                   style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
                   Confirmar Alquiler
                </a>
                <p style="margin-top: 20px; color: #777;">Si no realizaste esta solicitud, ignora este mensaje.</p>
            </div>
        </div>
    `;

    const opciones = {
        from: process.env.EMAIL_USER,
        subject: 'QUEDAN MENOS DE 12 HORAS PARA CONFIRMAR',
        to: destinatario.mail,
        html: htmlContent
    };

    try {
        const info = await config.sendMail(opciones);
        return {
            ok: true,
            message: 'Correo enviado correctamente',
            info: info.response
        };
    } catch (error: any) {
        return {
            ok: false,
            message: 'Error al enviar el correo',
            info: error.message
        };
    }

}
export { recuperarContraseña, confirmarCompraMailCorreo, avisoCompraExitosaMail , confirmRentMail, avisoPuntuarAlquiler, envioMailPropietarioAvisoCorreo, avisoPuntuarCompra, envioAvisoParaConfirmarAlquiler    
};

