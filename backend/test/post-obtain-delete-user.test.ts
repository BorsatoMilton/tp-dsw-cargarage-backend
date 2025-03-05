import request from 'supertest';
import { app } from '../src/index.js';
import { orm } from '../src/shared/db/orm.js';
import { Usuario } from '../src/components/usuario/usuario.entity.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  test('Datos del usuario', async () => {
    const response = await request(app)
      .get(`/api/usuarios/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      usuario: 'testuser',
      nombre: 'Test',
      apellido: 'User',
      mail: 'test@example.com'
    });
  });
});


/*
RESULTADO (realizado con Jest y Supertest)


[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$XsSRGJkLR4TvMzXMYz1gUOIIB.WDUSyLvubG0k7TKdXgriiGWjhOO', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 14 ms]

  at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
[query] db.getCollection('usuario').find({ _id: ObjectId('67c5fc015671a74260d8ccf8') }, {}).limit(1).toArray(); [took 12 ms, 1 result]

  at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
[query] db.getCollection('usuario').deleteMany({ _id: ObjectId('67c5fc015671a74260d8ccf8') }, {}); [took 4 ms]

  at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

PASS  test/post-obtain-user.test.ts
GET /api/usuarios/:id
√ Datos del usuario (50 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.293 s
Ran all test suites.

*/