import supertest from "supertest";
import { app } from "../src/index";
import { Usuario } from "../src/components/usuario/usuario.entity";
import { orm } from "../src/shared/db/orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const api = supertest(app);

test("Check username and mail", async () => {
  const username = "testuser1";
  const mail = "testingg@gmail.com";
  const response = await api.get(`/api/usuarios/${username}/${mail}`);
  expect(response.body).toBe(null);
});

/*
console.log
[query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser' }, { mail: 'test@gmail.com' } ] }, {}).limit(1).toArray(); [took 10 ms, 0 results]

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

PASS  test/check-username.test.ts
√ Check username and mail (52 ms)
                                                                                                                                                                                                        
Test Suites: 1 passed, 1 total                                                                                                                                                                          
Tests:       1 passed, 1 total                                                                                                                                                                          
Snapshots:   0 total
Time:        3.841 s, estimated 4 s
*/

beforeAll(async () => {
  const em = orm.em.fork();
  const otrosCampos = {
    usuario: "testuser",
    nombre: "Test",
    apellido: "User",
    mail: "test@example.com",
    clave: "password",
    direccion: "123 Test St",
    telefono: "1234567890",
    rol: "ADMIN",
  };

  const hashedPassword = await bcrypt.hash("password", 10);
  const user = em.create(Usuario, {
    ...otrosCampos,
    clave: hashedPassword,
  });

  await em.persistAndFlush(user);
});

afterAll(async () => {
  const em = orm.em.fork();
  await em.nativeDelete(Usuario, { usuario: "testuser" });
  await orm.close();
});

test("Check username and mail", async () => {
  const username = "testuser";
  const mail = "lalalala@gmail.com";
  const response = await api.get(`/api/usuarios/${username}/${mail}`);
  expect(response.body).toMatchObject({
    usuario: "testuser",
    nombre: "Test",
    apellido: "User",
    mail: "test@example.com",
    direccion: "123 Test St",
    telefono: "1234567890",
    rol: "ADMIN",
  });
});

/*
CUANDO EXISTE DEVUELVE SI ESPERA NULL

 ● Check username and mail                                                                                                                                                                             
                                                                                                                                                                                                        
    expect(received).toBe(expected) // Object.is equality

    Expected: null
    Received: {"apellido": "Borsato", "clave": "$2b$10$bmIfU2BFin8MQ3urSkR0MexByaF9SbbMnlPsNyrnH8ZLxzpWgYaXK", "direccion": "Calle falsa 123", "id": "67c0e4a78be6c5fe666ff706", "mail": "borsatomilton@gmail.com", "nombre": "Admin", "rol": "ADMIN", "telefono": "341326421", "usuario": "admin"}

      34 |     const mail = 'borsatomilton@gmail.com'
      35 |     const response = await api.get(`/api/usuarios/${username}/${mail}`)
    > 36 |     expect(response.body).toBe(null);
         |                           ^
      37 | });

      at Object.<anonymous> (test/check-username.test.ts:36:27)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        3.833 s, estimated 4 s

*/

/* CUANDO EXISTE
  console.log
    [query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$y6DXwsovzlihmjQxkJ1nZ.WiEmoTvStAvrcew8J99/mC3QlPibd1a', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 13 ms]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    [query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser1' }, { mail: 'testingg@gmail.com' } ] }, {}).limit(1).toArray(); [took 8 ms, 0 results]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    [query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser' }, { mail: 'lalalala@gmail.com' } ] }, {}).limit(1).toArray(); [took 4 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    [query] db.getCollection('usuario').deleteMany({ usuario: 'testuser' }, {}); [took 5 ms]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

 PASS  test/check-username.test.ts
  √ Check username and mail (45 ms)
  √ Check username and mail (22 ms)                                                                                                                                                                     
                                                                                                                                                                                                        
Test Suites: 1 passed, 1 total                                                                                                                                                                          
Tests:       2 passed, 2 total                                                                                                                                                                          
Snapshots:   0 total
Time:        4.154 s, estimated 5 s


*/
