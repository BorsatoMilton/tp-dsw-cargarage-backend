import { Request, Response } from 'express';
import {  Preference } from 'mercadopago';
import { mercadoPagoClient } from '../../config/mercadopago.js';
import { orm } from '../../shared/db/orm.js';
import { Alquiler } from '../alquiler/alquiler.entity.js';

const em = orm.em;


async function createPreference(req: Request, res: Response) {
    try {
        console.log('Creando preferencia de pago:', req.body);

        const { items, external_reference, rentalData } = req.body;
        const body = {
            items: items.map((item: any) => ({
                title: item.title,
                unit_price: Number(item.unit_price),
                quantity: Number(item.quantity),
                currency_id: 'ARS',
            })),
            external_reference: external_reference,
            metadata: {
                rentalData: JSON.stringify(rentalData),
            },
            back_urls: {
                success: 'https://cargarage-frontend.netlify.app/product/payment-status?payment_status=approved',
                failure: 'https://cargarage-frontend.netlify.app/product/payment-status?payment_status=failure',
                pending: 'https://cargarage-frontend.netlify.app/product/payment_status?payment_status=pending'
                
            },
            auto_return: 'approved',
        };

        const preferenceClient = new Preference(mercadoPagoClient);
        const preference = await preferenceClient.create({ body });

        res.json({ id: preference.id });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}
export { createPreference };
