import supertest from "supertest";
import { app } from "../src/index";

const api = supertest(app);

test("Usuario inexistente", async () => {
  const usuario = {
    user: "pepito",
    password: "1234",
  };
  const response = await api
    .post(`/api/usuarios/login`)
    .send(usuario)
    .expect(404);

  console.log(response.body);
});

test("Contraseña incorrecta", async () => {
  const usuario = {
    user: "admin",
    password: "1234",
  };
  const response = await api
    .post(`/api/usuarios/login`)
    .send(usuario)
    .expect(401);
  console.log(response.body);
});

test("Todo OK", async () => {
  const usuario = {
    user: "admin",
    password: "123456",
  };
  const response = await api
    .post(`/api/usuarios/login`)
    .send(usuario)
    .expect(200);
  console.log(response.body);
});

test("Error del server por falta de atributos", async () => {
  const usuario = {
    user: "admin",
  };
  const response = await api
    .post(`/api/usuarios/login`)
    .send(usuario)
    .expect(500);
  console.log(response.body);
});

/*
console.log
[query] db.getCollection('usuario').find({ usuario: 'pepito' }, {}).limit(1).toArray(); [took 3 ms, 0 results]

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
{ message: 'Usuario no encontrado' }

    at Object.<anonymous> (test/login.test.ts:21:13)

console.log                                                                                                                                                                                                                                 
[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]                                                                                                                              

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
{ message: 'Contraseña incorrecta' }

    at Object.<anonymous> (test/login.test.ts:33:13)

console.log                                                                                                                                                                                                                                 
[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]                                                                                                                              

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
{
    user: {
    id: '67c0e4a78be6c5fe666ff706',
    usuario: 'admin',
    clave: '$2b$10$bmIfU2BFin8MQ3urSkR0MexByaF9SbbMnlPsNyrnH8ZLxzpWgYaXK',
    nombre: 'Admin',
    apellido: 'Borsato',
    mail: 'borsatomilton@gmail.com',
    direccion: 'Calle falsa 123',
    telefono: '341326421',
    rol: 'ADMIN'
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.eyJpZCI6IjY3YzBlNGE3OGJlNmM1ZmU2NjZmZjcwNiIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzQxMDM5OTY0LCJleHAiOjE3NDEwNDM1NjR9.MfQdSCn1qk-WM-bcRpYKPjJXhmDo3LWO_bhKmxYZlVw'
}

    at Object.<anonymous> (test/login.test.ts:45:13)

console.log                                                                                                                                                                                                                                 
[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]                                                                                                                              

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log                                                                                                                                                                                                                                 
{ message: 'data and hash arguments required' }                                                                                                                                                                                           

    at Object.<anonymous> (test/login.test.ts:56:13)

PASS  test/login.test.ts
√ Usuario inexistente (48 ms)
√ Contraseña incorrecta (64 ms)                                                                                                                                                                                                             
√ Todo OK (66 ms)                                                                                                                                                                                                                           
√ Error del server por falta de atributos (7 ms)                                                                                                                                                                                            
                                                                                                                                                                                                                                            
Test Suites: 1 passed, 1 total                                                                                                                                                                                                                
Tests:       4 passed, 4 total                                                                                                                                                                                                                
Snapshots:   0 total
Time:        3.792 s, estimated 4 s
Ran all test suites matching /test\\login.test/i.

*/
