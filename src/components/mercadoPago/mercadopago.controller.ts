import { Request, Response } from 'express';
import {  Preference } from 'mercadopago';
import { mercadoPagoClient } from '../../config/mercadopago.js';
import { orm } from '../../shared/db/orm.js';
import dotenv from 'dotenv';
dotenv.config();

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
                success: `${process.env.CLIENT_URL}/product/payment-status?payment_status=approved`,
                failure: `${process.env.CLIENT_URL}/product/payment-status?payment_status=failure`,
                pending: `${process.env.CLIENT_URL}/product/payment-status?payment_status=pending`
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
