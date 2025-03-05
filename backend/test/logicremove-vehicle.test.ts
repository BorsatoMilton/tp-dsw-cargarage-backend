import supertest from "supertest";
import { app } from "../src/index";
import { Usuario } from '../src/components/usuario/usuario.entity';
import { orm } from '../src/shared/db/orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const api = supertest(app);

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
    })

    afterAll(async () => {
        const em = orm.em.fork();
        await em.nativeDelete(Usuario, { usuario: 'testuser' });
        await orm.close();
    });

    
    test("Baja lógica publicación | vehículo (No autorizado)", async () => {
        const id = '1';
        const response = await api.patch(`/api/vehiculos/${id}`)
        .expect(401)
        console.log(response.body)
    });


    test("Baja lógica publicación | vehículo (No existe)", async () => {
        const id = '1';
        const response = await api.patch(`/api/vehiculos/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        console.log(response.body)
    });

    
    test("Baja lógica publicación | vehículo (Lo elimina)", async () => {
        const id = '67c34dc68dbb2ff768d39ad2';
        const response = await api.patch(`/api/vehiculos/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        console.log(response.body)
    });
})

/*
[query] db.getCollection('usuario').insertMany([ { usuario: 'testuser', clave: '$2b$10$gKykEKUa7dvpI0NpiKITbeRP7a5zqs0vj6VXhf4s0rCjw3ium/ynm', nombre: 'Test', apellido: 'User', mail: 'test@example.com', direccion: '123 Test St', telefono: '1234567890', rol: 'ADMIN' } ], {}); [took 5 ms]

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
{ mensaje: 'Acceso denegado. Token no proporcionado.' }

    at Object.<anonymous> (test/logicremove-vehicle.test.ts:57:17)

console.log
[query] db.getCollection('vehiculo').find({ _id: '1' }, {}).limit(1).toArray(); [took 2 ms, 0 results]

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log                                                                                                                                                                                                                                 
{ message: 'Vehiculo no encontrado' }                                                                                                                                                                                                     

    at Object.<anonymous> (test/logicremove-vehicle.test.ts:65:17)

console.log
[query] db.getCollection('vehiculo').find({ _id: ObjectId('67c34dc68dbb2ff768d39ad2') }, {}).limit(1).toArray(); [took 1 ms, 1 result]

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log                                                                                                                                                                                                                                 
[query] db.getCollection('vehiculo').updateMany({ _id: ObjectId('67c34dc68dbb2ff768d39ad2') }, { '$set': { fechaBaja: ISODate('2025-03-03T22:43:59.812Z') } }, {}); [took 2 ms]                                                           

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

console.log
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

    at Object.<anonymous> (test/logicremove-vehicle.test.ts:73:17)

console.log                                                                                                                                                                                                                                 
[query] db.getCollection('usuario').deleteMany({ usuario: 'testuser' }, {}); [took 2 ms]                                                                                                                                                  

    at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

PASS  test/logicremove-vehicle.test.ts
GET /api/usuarios/:id                                                                                                                                                                                                                       
√ Baja lógica publicación | vehículo (No autorizado) (16 ms)                                                                                                                                                                              
√ Baja lógica publicación | vehículo (No existe) (14 ms)                                                                                                                                                                                  
√ Baja lógica publicación | vehículo (Lo elimina) (22 ms)                                                                                                                                                                                 
                                                                                                                                                                                                                                            
Test Suites: 1 passed, 1 total                                                                                                                                                                                                                
Tests:       3 passed, 3 total                                                                                                                                                                                                                
Snapshots:   0 total
Time:        4.234 s
*/

