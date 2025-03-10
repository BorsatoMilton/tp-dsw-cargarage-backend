# Reporte de Pruebas Automatizadas

## Pruebas E2E Frontend (Cypress)
>[!NOTE] (https://youtu.be/70ifzO4H8o8)

## Pruebas Unitarias Frontend (Angular/Jasmine/Karma)
**LoginComponent**  
[![Test Login](./capturas/Screenshot%202025-03-05%20231336.png)](./capturas/Screenshot%202025-03-05%20231336.png)

**NavBarComponent**  
[![Test NavBar](./capturas/Screenshot%202025-03-05%20231347.png)](./capturas/Screenshot%202025-03-05%20231347.png)

**AuthService**  
[![Test Auth](./capturas/Screenshot%202025-03-05%20231357.png)](./capturas/Screenshot%202025-03-05%20231357.png)

**DashboardComponent**  
[![Test Dashboard](./capturas/Screenshot%202025-03-05%20231406.png)](./capturas/Screenshot%202025-03-05%20231406.png)

## Pruebas Backend (Jest)

### 1. Check Username and Email
```javascript

TEST BACKEND:
1- check-usernameandmail

console.log
[query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser' }, { mail: 'test@gmail.com' } ] }, {}).limit(1).toArray(); [took 10 ms, 0 results]

PASS  test/check-username.test.ts
√ Check username and mail (52 ms)
Test Suites: 1 passed, 1 total                                                                                                                                                                          
Tests:       1 passed, 1 total                                                                                                                                                                          
Snapshots:   0 total
Time:        3.841 s, estimated 4 s
*/

TEST CUANDO EXISTE SI ESPERA NULL:


 ● Check username and mail

    expect(received).toBe(expected)

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

TEST CUANDO EXISTE: 


    [query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$y6DXwsovzlihmjQxkJ1nZ.WiEmoTvStAvrcew8J99/mC3QlPibd1a', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 13 ms]

    [query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser1' }, { mail: 'testingg@gmail.com' } ] }, {}).limit(1).toArray(); [took 8 ms, 0 results]


    [query] db.getCollection('usuario').find({ '$or': [ { usuario: 'testuser' }, { mail: 'lalalala@gmail.com' } ] }, {}).limit(1).toArray(); [took 4 ms, 1 result]

    [query] db.getCollection('usuario').deleteMany({ usuario: 'testuser' }, {}); [took 5 ms]

 PASS  test/check-username.test.ts
  √ Check username and mail (45 ms)
  √ Check username and mail (22 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.154 s, estimated 5 s



2- create-preference

TEST CON TOKEN:


[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$ShuYdyrZ7BUHqz.nDllEL.5pyQ179xrL9W2X2K/jte0ZoMnWUKFKW', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 5 ms]


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

[query] db.getCollection('usuario').deleteMany({ _id: ObjectId('67c62727a1cdbc23ebe97793') }, {}); [took 1 ms]


PASS  test/create-preference.test.ts
GET /api/usuarios/:id
√ Crear preferencia para mercado pago (1001 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.985 s, estimated 7 s
Ran all test suites matching /test\\create-preference.test/i.

3- logicremove-vehicle


[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$gKykEKUa7dvpI0NpiKITbeRP7a5zqs0vj6VXhf4s0rCjw3ium/ynm', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 5 ms]


{ mensaje: 'Acceso denegado. Token no proporcionado.' }

[query] db.getCollection('vehiculo').find({ _id: '1' }, {}).limit(1).toArray(); [took 2 ms, 0 results]


{ message: 'Vehiculo no encontrado' }


[query] db.getCollection('vehiculo').find({ _id: ObjectId('67c34dc68dbb2ff768d39ad2') }, {}).limit(1).toArray(); [took 1 ms, 1 result]

[query] db.getCollection('vehiculo').updateMany({ _id: ObjectId('67c34dc68dbb2ff768d39ad2') }, { '$set': { fechaBaja: ISODate('2025-03-03T22:43:59.812Z') } }, {}); [took 2 ms]                                                           

{
    message: 'Vehiculo dado de baja',
    data: {
    id: '67c34dc68dbb2ff768d39ad2',
    modelo: '2017',
    descripcion: 'Primera mano año 1978',
    fechaAlta: '2025-03-01T18:11:18.346Z',
    fechaBaja: '2025-03-03T22:43:59.812Z',
    precioVenta: 111,
    transmision: 'AUTOMÁTICO',
    precioAlquilerDiario: 10,
    kilometros: 1000,
    anio: 2024,
    imagenes: [ '1740852678343-208.jpeg' ],
    categoria: '6756d51bcf8cb87f2d399f6d',
    marca: '6756d6b3cf8cb87f2d399f73',
    propietario: '67c0e4d08be6c5fe666ff708'
    }
}

[query] db.getCollection('usuario').deleteMany({ usuario: 'testuser' }, {}); [took 2 ms]

PASS  test/logicremove-vehicle.test.ts
GET /api/usuarios/:id                                                                                                                                                                                                                       
√ Baja lógica publicación | vehículo (No autorizado) (16 ms)                                                                                                                                                                              
√ Baja lógica publicación | vehículo (No existe) (14 ms)                                                                                                                                                                                  
√ Baja lógica publicación | vehículo (Lo elimina) (22 ms)                                                                                                                                                                                 
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        4.234 s


4- login

[query] db.getCollection('usuario').find({ usuario: 'pepito' }, {}).limit(1).toArray(); [took 3 ms, 0 results]


{ message: 'Usuario no encontrado' }

[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]

{ message: 'Contraseña incorrecta' }

[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]                                                                       

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

[query] db.getCollection('usuario').find({ usuario: 'admin' }, {}).limit(1).toArray(); [took 1 ms, 1 result]                                                                       

{ message: 'data and hash arguments required' }

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



5 - post-obtain-delete-user

[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$XsSRGJkLR4TvMzXMYz1gUOIIB.WDUSyLvubG0k7TKdXgriiGWjhOO', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 14 ms]


[query] db.getCollection('usuario').find({ _id: ObjectId('67c5fc015671a74260d8ccf8') }, {}).limit(1).toArray(); [took 12 ms, 1 result]

[query] db.getCollection('usuario').deleteMany({ _id: ObjectId('67c5fc015671a74260d8ccf8') }, {}); [took 4 ms]

PASS  test/post-obtain-user.test.ts
GET /api/usuarios/:id
√ Datos del usuario (50 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.293 s
Ran all test suites.

