import request from 'supertest';
import { app } from "../src/index";
import { orm } from '../src/shared/db/orm';
import jwt from 'jsonwebtoken';
import { Usuario } from '../src/components/usuario/usuario.entity';
import bcrypt from 'bcrypt';


describe('GET /api/usuarios/:id', () => {
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    const em = orm.em.fork();
    const otrosCampos = {
      usuario: 'testuser',
      nombre: 'Test',
      apellido: 'User',
      mail: 'test@example.com',
      clave: 'password', 
      direccion: '123 Test St',
      telefono: '1234567890',
      rol: 'ADMIN' 
    }

    const hashedPassword = await bcrypt.hash('password', 10);
    const user = em.create(Usuario, {
      ...otrosCampos,
      clave: hashedPassword
    });
    
    await em.persistAndFlush(user);
    userId = user.id;

    authToken = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.SECRET_KEY_WEBTOKEN!, 
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    const em = orm.em.fork();
    await em.nativeDelete(Usuario, { id: userId });
    await orm.close();
  });

  test('Crear preferencia para mercado pago', async () => {
    const requestBody = {
      items: [{
        title: 'Comprar TEST',
        unit_price: 10,
        quantity: 1,
        currency_id: 'ARS'
      }],
      external_reference: 'TEST_123',
      rentalData: {
        bicicletaId: '123',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-07'
      }
    };

    const response = await request(app)  
    .post('/api/mercadopago/create-preference')
    .set('Authorization', `Bearer ${authToken}`)
    .send(requestBody)

    expect(response.body).toHaveProperty('id');
  });
});


/* CON TOKEN
[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$ShuYdyrZ7BUHqz.nDllEL.5pyQ179xrL9W2X2K/jte0ZoMnWUKFKW', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 5 ms]

  at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
Creando preferencia de pago: {
  items: [
    {
      title: 'Comprar TEST',
      unit_price: 10,
      quantity: 1,
      currency_id: 'ARS'
    }
  ],
  external_reference: 'TEST_123',
  rentalData: {
    bicicletaId: '123',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-01-07'
  }
}

  at createPreference (src/components/mercadoPago/mercadopago.controller.ts:12:17)

console.log
[query] db.getCollection('usuario').deleteMany({ _id: ObjectId('67c62727a1cdbc23ebe97793') }, {}); [took 1 ms]

  at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

PASS  test/create-preference.test.ts
GET /api/usuarios/:id
√ Crear preferencia para mercado pago (1001 ms)                                                                                                                                                                                           
                                                                                                                                                                                                                                          
Test Suites: 1 passed, 1 total                                                                                                                                                                                                                
Tests:       1 passed, 1 total                                                                                                                                                                                                                
Snapshots:   0 total
Time:        4.985 s, estimated 7 s
Ran all test suites matching /test\\create-preference.test/i.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?


*/