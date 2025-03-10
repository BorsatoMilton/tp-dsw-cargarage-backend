> [!NOTE]
> Para ver la documentación de la API en Swagger. 
1. Entrar en la carpeta de BACKEND (cd backend) 
2. Ejecutar con el comando "npm run start:dev" 
3. Abrir el navegador y entrar a la dirección "localhost:3000/api-docs"


## Endpoint : api/usuarios

Metodo: GET

Descripción:
Obtiene una lista de todos los usuarios registrados en el sistema.

Parámetros:
- No requiere parámetros.

Respuesta:
Retorna un Observable<User[]> con la lista de usuarios.

Ejemplo de Uso:
```typescript
usuariosService.getAllUser().subscribe(users => {
console.log('Lista de usuarios:', users);
});
```

Respuestas HTTP:
- 200: Lista de usuarios obtenida exitosamente.
- 500: Error al obtener los usuarios.

## Endpoint: api/usuarios/:usuario/:mail

Metodo: GET

Descripción:
Obtiene la información de un usuario utilizando el nombre de usuario y el correo electrónico.

Parámetros:
- usuario (String): Nombre de usuario.
- mail (String): Correo electrónico.

Respuesta:
Retorna un Observable<User | null> con la información del usuario o null si no se encuentra.

Ejemplo de Uso:
```typescript
usuariosService.getOneUserByEmailOrUsername('juanp', 'juan@example.com').subscribe(user => {
console.log('Usuario encontrado:', user);
});
```

Respuestas HTTP:
- 200: Usuario encontrado.
- 404: Usuario no encontrado.
- 500: Error al obtener el usuario.


## Endpoint: api/usuarios/:id

Metodo: GET

Descripción:
Obtiene la información de un usuario a partir de su identificador.

Método HTTP: GET
URL: /api/usuarios/{id}

Parámetros:
- id (string): Identificador único del usuario.

Respuesta:
Retorna un Observable<User> con la información del usuario.

Ejemplo de Uso:
```typescript
usuariosService.getOneUserById('1').subscribe(user => {
console.log('Usuario encontrado:', user);
});
```

Respuestas HTTP:
- 200: Usuario encontrado.
- 404: Usuario no encontrado.
- 500: Error al obtener el usuario.

## Endpoint: api/usuarios/checkusername/:username

METODO: GET
Descripción:
Verifica si un nombre de usuario ya existe en el sistema.

Parámetros:
- username (string): Nombre de usuario a verificar.

Respuesta:
Retorna un Observable<boolean> que indica si el nombre de usuario está disponible (true) o no (false).

Ejemplo de Uso:
```typescript
usuariosService.checkUsername('nuevoUsuario').subscribe(isAvailable => {
console.log('¿Nombre de usuario disponible?', isAvailable);
});
```

Respuestas HTTP:
- 200: Resultado de disponibilidad.
- 500: Error en la verificación.

## Endpoint: api/usuarios/checkemail/:mail

METODO: GET
Descripción:
Verifica si un correo electrónico ya se encuentra registrado en el sistema.

Parámetros:
- mail (string): Correo electrónico a verificar.

Respuesta:
Retorna un Observable<boolean> que indica si el correo electrónico está disponible (true) o no (false).

Ejemplo de Uso:
```typescript
usuariosService.checkEmail('nuevo@example.com').subscribe(isAvailable => {
console.log('¿Correo electrónico disponible?', isAvailable);
});
```

Respuestas HTTP:
- 200: Resultado de disponibilidad.
- 500: Error en la verificación.

## Endpoint: api/usuarios/validate/:id

METODO: POST

Descripción:
Valida si la contraseña proporcionada coincide con la contraseña actual del usuario.

Parámetros:
- id (string): Identificador del usuario.
- password (string): Contraseña a validar, enviada en el cuerpo de la solicitud.

Respuesta:
Retorna un Observable<boolean> que indica si la contraseña es válida (true) o no (false).

Ejemplo de Uso:
```typescript
usuariosService.validatePassword('1', 'contraseñaActual').subscribe(isValid => {
console.log('¿Contraseña válida?', isValid);
});
```

Respuestas HTTP:
- 200: Contraseña validada exitosamente.
- 404: Usuario no encontrado.
- 500: Error interno del servidor.

## Endpoint: api/usuarios/login

Metodo: POST

Descripción:
Verifica si existe el usuario y contraseña

Parámetros:
- {user: string, password: string}

Respuesta:
Retorna un Observable<User>

Ejemplo de Uso:
```typescript
authService.login('juanp', 'miContraseña123').subscribe((usuario: User) => {
console.log('Usuario autenticado:', usuario);
});
```

Respuestas HTTP:
- 200: Login exitoso.
- 401: Credenciales inválidas.
- 404: Usuario no encontrado.
- 500: Error al iniciar sesión.

## Endpoint: api/usuarios

Metodo: POST

Descripción:
Registra un nuevo usuario en el sistema.

Parámetros:
- data (FormData): Objeto que contiene la información del usuario a registrar.

Respuesta:
Retorna un Observable<User> con el usuario creado.

Ejemplo de Uso:

```typescript
const formData = new FormData();
formData.append('nombre', 'Juan Pérez');

usuariosService.addUser(formData).subscribe(user => {
console.log('Usuario creado:', user);
});
```

Respuestas HTTP:
- 201: Usuario creado.
- 400: Error de validación o usuario ya existente.
- 500: Error al crear el usuario.

## Endpoint: api/usuarios/reset

Metodo: POST

Descripción:
Restablece la contraseña del usuario utilizando un token de recuperación.

Parámetros:
- token (string): Token de recuperación de contraseña.
- newPassword (string): Nueva contraseña del usuario.

Respuesta:
Retorna un Observable<any> con la confirmación del restablecimiento de la contraseña.

Ejemplo de Uso:
```typescript
recuperacionService.resetPassword('token123', 'nuevaContraseña123').subscribe(response => {
console.log('Contraseña restablecida:', response);
});
```

Respuestas HTTP:
- 200: Contraseña actualizada exitosamente.
- 400: Solicitud incorrecta (contraseña corta o token inválido/expirado).
- 404: Usuario no encontrado.
- 500: Error interno del servidor.

## Endpoint: api/usuarios/:id

Metodo: PUT

Descripción:
Actualiza la información de un usuario existente.

Parámetros:
- user (User): Objeto que contiene los datos actualizados del usuario, incluyendo su id.

Respuesta:
Retorna un Observable<User> con la información actualizada del usuario.

Ejemplo de Uso:
```typescript
const updatedUser = { id: 1, nombre: 'Juan Actualizado', ... };
usuariosService.editUser(updatedUser).subscribe(user => {
console.log('Usuario actualizado:', user);
});
```

Respuestas HTTP:
- 200: Usuario actualizado.
- 404: Usuario no encontrado.
- 500: Error en el servidor.

## Endpoint: api/usuarios/:id

Metodo: PATCH

Descripción:
Actualiza (cambia) la contraseña de un usuario.

Parámetros:
- id (string): Identificador del usuario.
- data (any): Objeto que contiene la nueva contraseña (y otros datos relevantes, si aplica).

Respuesta:
Retorna un Observable<User> con el usuario actualizado.

Ejemplo de Uso:
```typescript
const newPasswordData = { password: 'nuevaContraseña123' };
usuariosService.changePassword('1', newPasswordData).subscribe(user => {
console.log('Contraseña actualizada:', user);
});
```

Respuestas HTTP:
- 200: Contraseña actualizada.
- 404: Usuario no encontrado.
- 500: Error al actualizar la contraseña.

## Enpoint: api/usuarios/:id

Metodo: DELETE

Descripción:
Elimina un usuario del sistema.

Parámetros:

- user (User): Objeto de usuario que debe incluir el id del usuario a eliminar.

Respuesta:
Retorna un Observable<User> con la confirmación de eliminación (usualmente el usuario eliminado).

Ejemplo de Uso:
```typescript
usuariosService.deleteUser({ id: 1, nombre: 'Juan Pérez', ... }).subscribe(user => {
console.log('Usuario eliminado:', user);
});
```

Respuestas HTTP:
- 200: Usuario eliminado con éxito.
- 404: Usuario no encontrado.
- 500: Error al eliminar el usuario.


------------------------------------------------ BRANDS ------------------------------------------------------



## Endpoint: api/brands

Metodo: GET

Descripción:
Obtiene una lista de todas las marcas registradas en el sistema.

Parámetros:
- No requiere parámetros.

Respuesta:
Retorna un Observable<Brand[]> con la lista de marcas.

Ejemplo de Uso:
```typescript
brandService.getAllBrand().subscribe(brands => {
        console.log('Lista de marcas:', brands);
});
```

Respuestas HTTP:
- 200: Lista de marcas obtenida exitosamente.
- 500: Error al obtener las marcas.

## Endpoint: api/brands/:id

Metodo: GET

Descripción:
Obtiene la información de una marca a partir de su identificador.

Parámetros:
- id (string): Identificador único de la marca.

Respuesta:
Retorna un Observable<Brand> con la información de la marca.

Ejemplo de Uso:
```typescript
brandService.getOneBrand('1').subscribe(brand => {
        console.log('Marca encontrada:', brand);
});
```

Respuestas HTTP:
- 200: Marca encontrada.
- 404: Marca no encontrada.
- 500: Error al obtener la marca.

## Endpoint: api/brands/byname/:name

Metodo: GET

Descripción:
Obtiene la información de una marca utilizando su nombre.

Parámetros:
- name (string): Nombre de la marca.

Respuesta:
Retorna un Observable<Brand> con la información de la marca.

Ejemplo de Uso:
```typescript
brandService.getOneBrandByName('Marca Ejemplo').subscribe(brand => {
        console.log('Marca encontrada:', brand);
});
```

Respuestas HTTP:
- 200: Marca encontrada.
- 404: Marca no encontrada.
- 500: Error al obtener la marca.

## Endpoint: api/brands

Metodo: POST

Descripción:
Registra una nueva marca en el sistema.

Parámetros:
- brand (Brand): Objeto que contiene la información de la marca a registrar.

Respuesta:
Retorna un Observable<Brand> con la marca creada.

Ejemplo de Uso:
```typescript
const newBrand = { nombre: 'Marca Nueva' };
brandService.addBrand(newBrand).subscribe(brand => {
        console.log('Marca creada:', brand);
});
```

Respuestas HTTP:
- 201: Marca creada.
- 400: La marca ya existe.
- 500: Error al crear la marca.

## Endpoint: api/brands/:id

Metodo: PUT

Descripción:
Actualiza la información de una marca existente.

Parámetros:
- brand (Brand): Objeto que contiene los datos actualizados de la marca, incluyendo su id.

Respuesta:
Retorna un Observable<Brand> con la información actualizada de la marca.

Ejemplo de Uso:
```typescript
const updatedBrand = { id: 1, nombre: 'Marca Actualizada' };
brandService.editBrand(updatedBrand).subscribe(brand => {
        console.log('Marca actualizada:', brand);
});
```

Respuestas HTTP:
- 200: Marca actualizada.
- 404: Marca no encontrada.
- 500: Error al actualizar la marca.

## Endpoint: api/brands/:id

Metodo: DELETE

Descripción:
Elimina una marca del sistema.

Parámetros:
- brand (Brand): Objeto de marca que debe incluir el id de la marca a eliminar.

Respuesta:
Retorna un Observable<Brand> con la confirmación de eliminación (usualmente la marca eliminada).

Ejemplo de Uso:
```typescript
const brandToDelete = { id: 1, nombre: 'Marca a Eliminar' };
brandService.deleteBrand(brandToDelete).subscribe(brand => {
        console.log('Marca eliminada:', brand);
});
```

Respuestas HTTP:
- 200: Marca eliminada.
- 404: Marca no encontrada.
- 500: Error al eliminar la marca.
------------------------------------------------------------- CATEGORIES ------------------------------------------------------------

## Endpoint: api/categories

Metodo: POST

Descripción:
Agrega una nueva categoría al sistema.

Parámetros:
- category (Category): Objeto que contiene la información de la categoría a registrar.

Respuesta:
Retorna un Observable<Category> con la categoría creada.

Ejemplo de Uso:
```typescript
const newCategory = { nombre: 'Nueva Categoría' };
categoryService.addCategory(newCategory).subscribe(category => {
        console.log('Categoría creada:', category);
});
```

Respuestas HTTP:
- 201: Categoría creada.
- 400: La categoría ya existe.
- 500: Error al crear la categoría.

## Endpoint: api/categories

Metodo: GET

Descripción:
Obtiene una lista de todas las categorías registradas en el sistema.

Parámetros:
- No requiere parámetros.

Respuesta:
Retorna un Observable<Category[]> con la lista de categorías.

Ejemplo de Uso:
```typescript
categoryService.getAllCategories().subscribe(categories => {
        console.log('Lista de categorías:', categories);
});
```

Respuestas HTTP:
- 200: Lista de categorías obtenida exitosamente.
- 500: Error al obtener las categorías.

## Endpoint: api/categories/:id

Metodo: GET

Descripción:
Obtiene la información de una categoría a partir de su identificador.

Parámetros:
- id (string): Identificador único de la categoría.

Respuesta:
Retorna un Observable<Category> con la información de la categoría.

Ejemplo de Uso:
```typescript
categoryService.getOneCategory('1').subscribe(category => {
        console.log('Categoría encontrada:', category);
});
```

Respuestas HTTP:
- 200: Categoría encontrada.
- 404: Categoría no encontrada.
- 500: Error al obtener la categoría.

## Endpoint: api/categories/byname/:name

Metodo: GET

Descripción:
Obtiene la información de una categoría utilizando su nombre.

Parámetros:
- name (string): Nombre de la categoría.

Respuesta:
Retorna un Observable<Category> con la información de la categoría.

Ejemplo de Uso:
```typescript
categoryService.getOneCategoryByName('Categoría Ejemplo').subscribe(category => {
        console.log('Categoría encontrada:', category);
});
```

Respuestas HTTP:
- 200: Categoría encontrada.
- 404: Categoría no encontrada.
- 500: Error al obtener la categoría.

## Endpoint: api/categories/:id

Metodo: PUT

Descripción:
Actualiza la información de una categoría existente.

Parámetros:
- category (Category): Objeto que contiene los datos actualizados de la categoría, incluyendo su id.

Respuesta:
Retorna un Observable<Category> con la información actualizada de la categoría.

Ejemplo de Uso:
```typescript
const updatedCategory = { id: '1', nombre: 'Categoría Actualizada' };
categoryService.editCategory(updatedCategory).subscribe(category => {
        console.log('Categoría actualizada:', category);
});
```

Respuestas HTTP:
- 200: Categoría actualizada.
- 404: Categoría no encontrada.
- 500: Error al actualizar la categoría.

## Endpoint: api/categories/:id

Metodo: DELETE

Descripción:
Elimina una categoría del sistema.

Parámetros:
- id (string): Identificador único de la categoría a eliminar.

Respuesta:
Retorna un Observable<Category> con la confirmación de eliminación (usualmente la categoría eliminada).

Ejemplo de Uso:
```typescript
categoryService.deleteCategory({ id: '1' }).subscribe(category => {
        console.log('Categoría eliminada:', category);
});
```

Respuestas HTTP:
- 200: Categoría eliminada.
- 404: Categoría no encontrada.
- 500: Error al eliminar la categoría.

-------------------------------------------------------- COMPRA -------------------------------------------------

## Endpoint: api/categories

Metodo: POST

Descripción:
Agrega una nueva categoría al sistema.

Parámetros:
- category (Category): Objeto que contiene la información de la categoría a registrar.

Respuesta:
Retorna un Observable<Category> con la categoría creada.

Ejemplo de Uso:
```typescript
const newCategory = { nombre: 'Nueva Categoría' };
categoryService.addCategory(newCategory).subscribe(category => {
        console.log('Categoría creada:', category);
});
```

Respuestas HTTP:
- 201: Categoría creada.
- 400: La categoría ya existe.
- 500: Error al crear la categoría.

## Endpoint: api/categories

Metodo: GET

Descripción:
Obtiene una lista de todas las categorías registradas en el sistema.

Parámetros:
- No requiere parámetros.

Respuesta:
Retorna un Observable<Category[]> con la lista de categorías.

Ejemplo de Uso:
```typescript
categoryService.getAllCategories().subscribe(categories => {
        console.log('Lista de categorías:', categories);
});
```

Respuestas HTTP:
- 200: Lista de categorías obtenida exitosamente.
- 500: Error al obtener las categorías.

## Endpoint: api/categories/:id

Metodo: GET

Descripción:
Obtiene la información de una categoría a partir de su identificador.

Parámetros:
- id (string): Identificador único de la categoría.

Respuesta:
Retorna un Observable<Category> con la información de la categoría.

Ejemplo de Uso:
```typescript
categoryService.getOneCategory('1').subscribe(category => {
        console.log('Categoría encontrada:', category);
});
```

Respuestas HTTP:
- 200: Categoría encontrada.
- 404: Categoría no encontrada.
- 500: Error al obtener la categoría.

## Endpoint: api/categories/byname/:name

Metodo: GET

Descripción:
Obtiene la información de una categoría utilizando su nombre.

Parámetros:
- name (string): Nombre de la categoría.

Respuesta:
Retorna un Observable<Category> con la información de la categoría.

Ejemplo de Uso:
```typescript
categoryService.getOneCategoryByName('Categoría Ejemplo').subscribe(category => {
        console.log('Categoría encontrada:', category);
});
```

Respuestas HTTP:
- 200: Categoría encontrada.
- 404: Categoría no encontrada.
- 500: Error al obtener la categoría.

## Endpoint: api/categories/:id

Metodo: PUT

Descripción:
Actualiza la información de una categoría existente.

Parámetros:
- category (Category): Objeto que contiene los datos actualizados de la categoría, incluyendo su id.

Respuesta:
Retorna un Observable<Category> con la información actualizada de la categoría.

Ejemplo de Uso:
```typescript
const updatedCategory = { id: '1', nombre: 'Categoría Actualizada' };
categoryService.editCategory(updatedCategory).subscribe(category => {
        console.log('Categoría actualizada:', category);
});
```

Respuestas HTTP:
- 200: Categoría actualizada.
- 404: Categoría no encontrada.
- 500: Error al actualizar la categoría.

## Endpoint: api/categories/:id


Metodo: DELETE

Descripción:
Elimina una categoría del sistema.

Parámetros:
- id (string): Identificador único de la categoría a eliminar.

Respuesta:
Retorna un Observable<Category> con la confirmación de eliminación (usualmente la categoría eliminada).

Ejemplo de Uso:
```typescript
categoryService.deleteCategory({ id: '1' }).subscribe(category => {
        console.log('Categoría eliminada:', category);
});
```

Respuestas HTTP:
- 200: Categoría eliminada.
- 404: Categoría no encontrada.
- 500: Error al eliminar la categoría

-------------------------------------------------------- RECUPERACIÓN DE CONTRASEÑA -------------------------------------------------



## Endpoint: api/recuperacion

Metodo: POST

Descripción:
Crea un token de restablecimiento de contraseña y envía un correo electrónico.

Parámetros:
- email (string): Correo electrónico del usuario.

Respuesta:
Retorna un Observable<any> con la confirmación del envío del correo y la creación del token.

Ejemplo de Uso:
```typescript
recuperacionService.createPasswordResetToken('correo@example.com').subscribe(response => {
        console.log('Token de restablecimiento creado y correo enviado:', response);
});
```

Respuestas HTTP:
- 201: Token creado y correo enviado.
- 404: Usuario no encontrado.
- 500: Error al crear el token.

## Endpoint: api/recuperacion/:token

Metodo: GET

Descripción:
Valida un token de restablecimiento de contraseña.

Parámetros:
- token (string): Token de restablecimiento de contraseña.

Respuesta:
Retorna un Observable<any> con la validación del token.

Ejemplo de Uso:
```typescript
recuperacionService.validatePasswordResetToken('token123').subscribe(response => {
        console.log('Token válido:', response);
});
```

Respuestas HTTP:
- 200: Token válido.
- 400: Token expirado.
- 404: Token no encontrado.

-------------------------------------------------------- CALIFICACIONES -------------------------------------------------

## Endpoint: api/calificaciones/:userId

Metodo: GET

Descripción:
Obtiene una lista de todas las calificaciones realizadas por un usuario específico.

Parámetros:
- userId (string): Identificador único del usuario.

Respuesta:
Retorna un Observable<Qualification[]> con la lista de calificaciones del usuario.

Ejemplo de Uso:
```typescript
qualificationsService.getQualificationsByUserId('userId123').subscribe(calificaciones => {
        console.log('Lista de calificaciones del usuario:', calificaciones);
});
```

Respuestas HTTP:
- 200: Lista de calificaciones obtenida exitosamente.
- 500: Error al obtener las calificaciones.

## Endpoint: api/calificaciones/:userId/:rentId

Metodo: GET

Descripción:
Verifica si una calificación ya existe para un usuario y un alquiler específicos.

Parámetros:
- userId (string): Identificador único del usuario.
- rentId (string): Identificador único del alquiler.

Respuesta:
Retorna un Observable<boolean> que indica si la calificación existe (true) o no (false).

Ejemplo de Uso:
```typescript
qualificationsService.checkQualificationExists('userId123', 'rentId456').subscribe(exists => {
        console.log('¿Calificación existe?', exists);
});
```

Respuestas HTTP:
- 200: Calificación encontrada.
- 500: Error al obtener la calificación.

## Endpoint: api/calificaciones

Metodo: POST

Descripción:
Crea una nueva calificación en el sistema.

Parámetros:
- qualification (Qualification): Objeto que contiene la información de la calificación a registrar.

Respuesta:
Retorna un Observable<Qualification> con la calificación creada.

Ejemplo de Uso:
```typescript
const newQualification = { userId: 'userId123', rentId: 'rentId456', score: 5, comment: 'Excelente servicio' };
qualificationsService.createQualification(newQualification).subscribe(qualification => {
        console.log('Calificación creada:', qualification);
});
```

Respuestas HTTP:
- 201: Calificación creada.
- 400: Error de validación o calificación ya existente.
- 500: Error al crear la calificación.

-------------------------------------------------------- ALQUILER -------------------------------------------------


## Endpoint: api/alquiler

Metodo: GET

Descripción:
Obtiene una lista de todos los alquileres registrados en el sistema.

Parámetros:
- No requiere parámetros.

Respuesta:
Retorna un Observable<Rent[]> con la lista de alquileres.

Ejemplo de Uso:
```typescript
rentService.getAllRents().subscribe(rents => {
        console.log('Lista de alquileres:', rents);
});
```

Respuestas HTTP:
- 200: Lista de alquileres obtenida exitosamente.
- 500: Error al obtener los alquileres.

## Endpoint: api/alquiler/vehiculo/:id

Metodo: GET

Descripción:
Obtiene una lista de todos los alquileres de un vehículo específico.

Parámetros:
- id (string): Identificador único del vehículo.

Respuesta:
Retorna un Observable<Rent[]> con la lista de alquileres del vehículo.

Ejemplo de Uso:
```typescript
rentService.getRentsByVehicle('vehiculoId123').subscribe(rents => {
        console.log('Lista de alquileres del vehículo:', rents);
});
```

Respuestas HTTP:
- 200: Lista de alquileres del vehículo obtenida exitosamente.
- 500: Error al obtener los alquileres por vehículo.

## Endpoint: api/alquiler/usuario/:id

Metodo: GET

Descripción:
Obtiene una lista de todos los alquileres realizados por un usuario específico.

Parámetros:
- id (string): Identificador único del usuario.

Respuesta:
Retorna un Observable<Rent[]> con la lista de alquileres del usuario.

Ejemplo de Uso:
```typescript
rentService.getRentsByUser('usuarioId123').subscribe(rents => {
        console.log('Lista de alquileres del usuario:', rents);
});
```

Respuestas HTTP:
- 200: Lista de alquileres del usuario obtenida exitosamente.
- 500: Error al obtener los alquileres por usuario.

## Endpoint: api/alquiler/:id

Metodo: GET

Descripción:
Obtiene la información de un alquiler a partir de su identificador.

Parámetros:
- id (string): Identificador único del alquiler.

Respuesta:
Retorna un Observable<Rent> con la información del alquiler.

Ejemplo de Uso:
```typescript
rentService.getOneRent('alquilerId123').subscribe(rent => {
        console.log('Alquiler encontrado:', rent);
});
```

Respuestas HTTP:
- 200: Alquiler encontrado.
- 404: Alquiler no encontrado.
- 500: Error al obtener el alquiler.

## Endpoint: api/alquiler

Metodo: POST

Descripción:
Agrega un nuevo alquiler al sistema.

Parámetros:
- rent (Rent): Objeto que contiene la información del alquiler a registrar.

Respuesta:
Retorna un Observable<Rent> con el alquiler creado.

Ejemplo de Uso:
```typescript
const newRent = { vehiculoId: 'vehiculoId123', usuarioId: 'usuarioId123', fechaInicio: '2023-01-01', fechaFin: '2023-01-10' };
rentService.addRent(newRent).subscribe(rent => {
        console.log('Alquiler creado:', rent);
});
```

Respuestas HTTP:
- 201: Alquiler creado.
- 500: Error al crear el alquiler.

## Endpoint: api/alquiler/confirmarAlquiler

Metodo: POST

Descripción:
Confirma un alquiler enviando un correo electrónico al destinatario.

Parámetros:
- mail (string): Correo electrónico del destinatario.
- id (number): Identificador único del alquiler.

Respuesta:
Retorna un Observable<Rent> con la confirmación del alquiler.

Ejemplo de Uso:
```typescript
rentService.confirmRent('correo@example.com', 123).subscribe(rent => {
        console.log('Alquiler confirmado:', rent);
});
```

Respuestas HTTP:
- 200: Alquiler confirmado.
- 500: Error en el servidor.

## Endpoint: api/alquiler/confirmarAlquilerMail/{id}

Metodo: POST

Descripción:
Confirma un alquiler enviando un correo electrónico al destinatario.

Parámetros:
- id (string): Identificador único del alquiler.

Respuesta:
Retorna un Observable<Rent> con la confirmación del alquiler.

Ejemplo de Uso:
typescript
rentService.confirmRent('correo@example.com', 123).subscribe(rent => {
        console.log('Alquiler confirmado:', rent);
});


Respuestas HTTP:
- 201: Alquiler confirmado.
- 404: Alquiler no encontrado.
- 500: Error al confirmar el alquiler.


## Endpoint: api/alquiler/cancelar/:id

Metodo: PUT

Descripción:
Cancela un alquiler existente.

Parámetros:
- rent (Rent): Objeto de alquiler que debe incluir el id del alquiler a cancelar.

Respuesta:
Retorna un Observable<Rent> con la confirmación de cancelación (usualmente el alquiler cancelado).

Ejemplo de Uso:
```typescript
const rentToCancel = { id: 'alquilerId123', ... };
rentService.cancelRent(rentToCancel).subscribe(rent => {
        console.log('Alquiler cancelado:', rent);
});
```

Respuestas HTTP:
- 200: Alquiler cancelado.
- 500: Error al cancelar el alquiler.

## Endpoint: api/alquiler/:id

Metodo: DELETE

Descripción:
Elimina un alquiler del sistema.

Parámetros:
- rent (Rent): Objeto de alquiler que debe incluir el id del alquiler a eliminar.

Respuesta:
Retorna un Observable<Rent> con la confirmación de eliminación (usualmente el alquiler eliminado).

Ejemplo de Uso:
```typescript
const rentToDelete = { id: 'alquilerId123', ... };
rentService.deleteRent(rentToDelete).subscribe(rent => {
        console.log('Alquiler eliminado:', rent);
});
```

Respuestas HTTP:
- 200: Alquiler eliminado.
- 404: Alquiler no encontrado.
- 500: Error al eliminar el alquiler.


-------------------------------------------------------- VEHÍCULOS -------------------------------------------------

## Endpoint: api/vehiculos

Metodo: GET

Descripción:
Obtiene una lista de todos los vehículos registrados en el sistema.

Parámetros:
No requiere parámetros.

Respuesta:
Retorna un Observable<Vehicle[]> con la lista de vehículos.

Ejemplo de Uso:
```typescript
vehicleService.getAllVehicle().subscribe(vehicles => {
        console.log('Lista de vehículos:', vehicles);
});
```

Respuestas HTTP:
- 200: Lista de vehículos obtenida exitosamente.
- 500: Error al obtener los vehículos.

## Endpoint: api/vehiculos/user/:id

Metodo: GET

Descripción:
Obtiene una lista de todos los vehículos registrados por un usuario específico.

Parámetros:
- id (string): Identificador único del usuario.

Respuesta:
Retorna un Observable<Vehicle[]> con la lista de vehículos del usuario.

Ejemplo de Uso:
```typescript
vehicleService.getAllVehicleByUser('userId123').subscribe(vehicles => {
        console.log('Lista de vehículos del usuario:', vehicles);
});
```

Respuestas HTTP:
- 200: Lista de vehículos del usuario obtenida exitosamente.
- 500: Error al obtener los vehículos del usuario.

## Endpoint: api/vehiculos/:id

Metodo: GET

Descripción:
Obtiene la información de un vehículo a partir de su identificador.

Parámetros:
- id (string): Identificador único del vehículo.

Respuesta:
Retorna un Observable<Vehicle> con la información del vehículo.

Ejemplo de Uso:
```typescript
vehicleService.getOneVehicle('vehicleId123').subscribe(vehicle => {
        console.log('Vehículo encontrado:', vehicle);
});
```

Respuestas HTTP:
- 200: Vehículo encontrado.
- 404: Vehículo no encontrado.
- 500: Error al obtener el vehículo.

## Endpoint: api/vehiculos/categoria/{id}

Metodo: GET

Descripción:
Obtiene una lista de vehículos por ID de categoría.

Parámetros:
- id (string): Identificador único de la categoría.

Respuesta:
Retorna un Observable<Vehicle[]> con la lista de vehículos por categoría.

Ejemplo de Uso:
```typescript
vehicleService.getVehiclesByCategory('categoriaId123').subscribe(vehicles => {
        console.log('Lista de vehículos por categoría:', vehicles);
});
```

Respuestas HTTP:
- 200: Lista de vehículos por categoría obtenida exitosamente.
- 500: Error al obtener los vehículos por categoría.

## Endpoint: api/vehiculos

Metodo: POST

Descripción:
Agrega un nuevo vehículo al sistema.

Parámetros:
- formData (FormData): Objeto que contiene la información del vehículo a registrar.

Respuesta:
Retorna un Observable<Vehicle> con el vehículo creado.

Ejemplo de Uso:
```typescript
const formData = new FormData();
formData.append('marca', 'Toyota');
formData.append('modelo', 'Corolla');
formData.append('año', '2021');
vehicleService.addVehicle(formData).subscribe(vehicle => {
        console.log('Vehículo creado:', vehicle);
});
```

Respuestas HTTP:
- 201: Vehículo creado.
- 400: Ids de marca, categoría o propietario no válidos.
- 500: Error al crear el vehículo.

## Endpoint: api/vehiculos/:id

Metodo: PUT

Descripción:
Actualiza la información de un vehículo existente.

Parámetros:
- vehicle (Vehicle): Objeto que contiene los datos actualizados del vehículo, incluyendo su id.

Respuesta:
Retorna un Observable<Vehicle> con la información actualizada del vehículo.

Ejemplo de Uso:
```typescript
const updatedVehicle = { id: 'vehicleId123', marca: 'Toyota', modelo: 'Corolla', año: '2022' };
vehicleService.editVehicle(updatedVehicle).subscribe(vehicle => {
        console.log('Vehículo actualizado:', vehicle);
});
```

Respuestas HTTP:
- 200: Vehículo actualizado.
- 404: Vehículo no encontrado.
- 500: Error al actualizar el vehículo.

## Endpoint: api/vehiculos/:id

Metodo: PATCH

Descripción:
Baja lógica de un vehículo existente.

Parámetros:
- id (string): Identificador único del vehículo.

Respuesta:
Retorna un Observable<Vehicle> con la confirmación de la baja lógica del vehículo.

Ejemplo de Uso:
```typescript
const vehicleToDeactivate = { id: 'vehicleId123', ... };
vehicleService.deactivateVehicle(vehicleToDeactivate).subscribe(vehicle => {
        console.log('Vehículo dado de baja:', vehicle);
});
```

Respuestas HTTP:
- 200: Vehículo dado de baja.
- 404: Vehículo no encontrado.
- 500: Error al dar de baja el vehículo.

## Endpoint: api/vehiculos/:id

Metodo: DELETE

Descripción:
Elimina un vehículo del sistema.

Parámetros:
- vehicle (Vehicle): Objeto de vehículo que debe incluir el id del vehículo a eliminar.

Respuesta:
Retorna un Observable<Vehicle> con la confirmación de eliminación (usualmente el vehículo eliminado).

Ejemplo de Uso:
```typescript
const vehicleToDelete = { id: 'vehicleId123', marca: 'Toyota', modelo: 'Corolla' };
vehicleService.deleteVehicle(vehicleToDelete).subscribe(vehicle => {
        console.log('Vehículo eliminado:', vehicle);
});
```

Respuestas HTTP:
- 200: Vehículo eliminado.
- 404: Vehículo no encontrado.
- 500: Error al eliminar el vehículo.


-------------------------------------------------------- COMPRAS -------------------------------------------------

## Endpoint: api/compras

Metodo: GET

Descripción:
Obtiene todas las compras registradas en el sistema.

Parámetros:
No requiere parámetros.

Respuesta:
Retorna un Observable<Compra[]> con la lista de compras.

Ejemplo de Uso:
```typescript
compraService.getAllCompras().subscribe(compras => {
        console.log('Lista de compras:', compras);
});
```

Respuestas HTTP:
- 200: Lista de compras obtenida exitosamente.
- 500: Error al obtener las compras.

## Endpoint: api/compras/byuser/:id

Metodo: GET

Descripción:
Obtiene compras por ID de usuario.

Parámetros:
- id (string): Identificador único del usuario.

Respuesta:
Retorna un Observable<Compra[]> con la lista de compras del usuario.

Ejemplo de Uso:
```typescript
compraService.getComprasByUser('userId123').subscribe(compras => {
        console.log('Lista de compras del usuario:', compras);
});
```

Respuestas HTTP:
- 200: Lista de compras del usuario obtenida exitosamente.
- 500: Error al obtener las compras por usuario.

## Endpoint: api/compras/byvehiculo/:idVehiculo

Metodo: GET

Descripción:
Obtiene compras por ID de vehículo.

Parámetros:
- idVehiculo (string): Identificador único del vehículo.

Respuesta:
Retorna un Observable<Compra[]> con la lista de compras del vehículo.

Ejemplo de Uso:
```typescript
compraService.getComprasByVehiculo('vehiculoId123').subscribe(compras => {
        console.log('Lista de compras del vehículo:', compras);
});
```

Respuestas HTTP:
- 200: Lista de compras del vehículo obtenida exitosamente.
- 500: Error al obtener las compras por vehículo.

## Endpoint: api/compras

Metodo: POST

Descripción:
Crea una nueva compra.

Parámetros:
- compra (Compra): Objeto que contiene la información de la compra a registrar.

Respuesta:
Retorna un Observable<Compra> con la compra creada.

Ejemplo de Uso:
```typescript
const newCompra = { vehiculoId: 'vehiculoId123', usuarioId: 'usuarioId123', fechaCompra: '2023-01-01' };
compraService.addCompra(newCompra).subscribe(compra => {
        console.log('Compra creada:', compra);
});
```

Respuestas HTTP:
- 201: Compra creada exitosamente.
- 500: Error al crear la compra.

## Endpoint: api/compras/avisoCompraExitosa

Metodo: POST

Descripción:
Envía aviso de compra exitosa.

Parámetros:
- mail (string): Correo electrónico del destinatario.

Respuesta:
Retorna un Observable con la confirmación del aviso enviado.

Ejemplo de Uso:
```typescript
compraService.avisoCompraExitosa('correo@example.com').subscribe(response => {
        console.log('Aviso enviado:', response);
});
```

Respuestas HTTP:
- 200: Aviso enviado correctamente.
- 500: Error al enviar el aviso.

## Endpoint: api/compras/confirmarCompraAviso/:idCompra

Metodo: POST

Descripción:
Confirma una compra enviando un correo electrónico.

Parámetros:
- idCompra (string): Identificador único de la compra.

Respuesta:
Retorna un Observable con la confirmación de la compra.

Ejemplo de Uso:
```typescript
compraService.confirmarCompraMail('compraId123').subscribe(response => {
        console.log('Compra confirmada:', response);
});
```

Respuestas HTTP:
- 200: Compra confirmada correctamente.
- 500: Error al confirmar la compra.

## Endpoint: api/compras/confirmarCompra

Metodo: PATCH

Descripción:
Confirma una compra.

Parámetros:
- idCompra (string): Identificador único de la compra.

Respuesta:
Retorna un Observable<Compra> con la compra confirmada.

Ejemplo de Uso:
```typescript
const compraToConfirm = { idCompra: 'compraId123' };
compraService.confirmarCompra(compraToConfirm).subscribe(compra => {
        console.log('Compra confirmada:', compra);
});
```

Respuestas HTTP:
- 200: Compra confirmada exitosamente.
- 400: ID de compra requerido.
- 404: Compra no encontrada.
- 500: Error al confirmar la compra.

## Endpoint: api/compras/cancelarCompra

Metodo: PATCH

Descripción:
Cancela una compra.

Parámetros:
- id (string): Identificador único de la compra.

Respuesta:
Retorna un Observable<Compra> con la compra cancelada.

Ejemplo de Uso:
```typescript
const compraToCancel = { id: 'compraId123' };
compraService.cancelarCompra(compraToCancel).subscribe(compra => {
        console.log('Compra cancelada:', compra);
});
```

Respuestas HTTP:
- 200: Compra cancelada exitosamente.
- 400: ID de compra requerido.
- 404: Compra no encontrada.
- 500: Error al cancelar la compra.

## Endpoint: api/compras/:id 

Metodo: DELETE

Descripción:
Elimina una compra del sistema.

Parámetros:
- id (string): Identificador único de la compra.

Respuesta:
Retorna un Observable<Compra> con la confirmación de eliminación (usualmente la compra eliminada).

Ejemplo de Uso:
```typescript
const compraToDelete = { id: 'compraId123' };
compraService.deleteCompra(compraToDelete).subscribe(compra => {
        console.log('Compra eliminada:', compra);
});
```

Respuestas HTTP:
- 200: Compra eliminada exitosamente.
- 404: Compra no encontrada.
- 500: Error al eliminar la compra.


-------------------------------------------------------- FAQs -------------------------------------------------

## Endpoint: api/faqs

Metodo: GET

Descripción:
Obtiene todas las FAQs registradas en el sistema.

Parámetros:
No requiere parámetros.

Respuesta:
Retorna un Observable<FAQ[]> con la lista de FAQs.

Ejemplo de Uso:
```typescript
faqService.getAllFaqs().subscribe(faqs => {
        console.log('Lista de FAQs:', faqs);
});
```

Respuestas HTTP:
- 200: Lista de FAQs obtenida exitosamente.
- 500: Error al obtener las FAQs.

## Endpoint: api/faqs

Metodo: POST

Descripción:
Agrega una nueva FAQ al sistema.

Parámetros:
- faq (FAQ): Objeto que contiene la información de la FAQ a registrar.

Respuesta:
Retorna un Observable<FAQ> con la FAQ creada.

Ejemplo de Uso:
```typescript
const newFaq = { pregunta: '¿Cómo puedo registrarme?', respuesta: 'Puedes registrarte haciendo clic en el botón de registro.' };
faqService.addFaq(newFaq).subscribe(faq => {
        console.log('FAQ agregada:', faq);
});
```

Respuestas HTTP:
- 200: FAQ agregada exitosamente.
- 500: Error al agregar la FAQ.

## Endpoint: api/faqs/{id}

Metodo: PUT

Descripción:
Actualiza una FAQ existente.

Parámetros:
- id (string): Identificador único de la FAQ.
- faq (FAQ): Objeto que contiene los datos actualizados de la FAQ.

Respuesta:
Retorna un Observable<FAQ> con la FAQ actualizada.

Ejemplo de Uso:
```typescript
const updatedFaq = { id: 'faqId123', pregunta: '¿Cómo puedo cambiar mi contraseña?', respuesta: 'Puedes cambiar tu contraseña desde la configuración de tu cuenta.' };
faqService.updateFaq(updatedFaq).subscribe(faq => {
        console.log('FAQ actualizada:', faq);
});
```

Respuestas HTTP:
- 200: FAQ actualizada exitosamente.
- 500: Error al actualizar la FAQ.

## Endpoint: api/faqs/{id}

Metodo: DELETE

Descripción:
Elimina una FAQ del sistema.

Parámetros:
- id (string): Identificador único de la FAQ.

Respuesta:
Retorna un Observable<FAQ> con la confirmación de eliminación (usualmente la FAQ eliminada).

Ejemplo de Uso:
```typescript
const faqToDelete = { id: 'faqId123' };
faqService.deleteFaq(faqToDelete).subscribe(faq => {
        console.log('FAQ eliminada:', faq);
});
```

Respuestas HTTP:
- 200: FAQ eliminada exitosamente.
- 500: Error al eliminar la FAQ.


-------------------------------------------------------- MERCADOPAGO -------------------------------------------------

## Endpoint: api/mercadopago/create-preference

Metodo: POST

Descripción:
Crea una preferencia de pago en Mercado Pago.

Parámetros:
- paymentPreference (PaymentPreference): Objeto que contiene la información de la preferencia de pago.

Respuesta:
Retorna un Observable con el ID de la preferencia de pago creada.

Ejemplo de Uso:
```typescript
const paymentPreference = {
    items: [
        { title: 'Producto 1', unit_price: 100, quantity: 1 }
    ],
    external_reference: 'ref123',
    rentalData: { ... }
};
mercadoPagoService.createPreference(paymentPreference).subscribe(response => {
        console.log('Preferencia de pago creada:', response.id);
});
```

Respuestas HTTP:
- 201: Preferencia de pago creada.
- 500: Error interno del servidor.

## Endpoint: api/mercadopago/webhook

Metodo: POST

Descripción:
Webhook para recibir notificaciones de Mercado Pago.

Parámetros:
- type (string): Tipo de notificación.
- data (object): Objeto que contiene el ID del pago.

Respuesta:
Retorna un Observable con la confirmación de recepción de la notificación.

Ejemplo de Uso:
```typescript
const notification = {
    type: 'payment',
    data: { id: 'paymentId123' }
};
mercadoPagoService.webhook(notification).subscribe(response => {
        console.log('Notificación recibida:', response);
});
```

Respuestas HTTP:
- 200: Notificación recibida correctamente.
- 404: Pago no encontrado.
- 409: El pago ya fue procesado.
- 500: Error interno del servidor.