# Documentación de la API REST

Documentación de la API REST de CarGarage.
Cátedra: Desarrollo de Software
<hr>
Profesores: Meca Adrian | Tabacman Ricardo
Año cursado: 2024

## Índice
- [Descripción General](#descripción-general)
- [Proposal](./proposal.md)
- [Endpoints](./endpoints.md)
- [Configuración](./setup.md)
- [Diagramas y Esquemas](./diagramas.md)
- [TESTS](./test.md) 

## Descripción General
La API REST para el Cargarage ha sido diseñada para gestionar todas las operaciones y la información relacionada con la compra-venta y alquiler de vehículos. Su objetivo principal es facilitar a los usuarios (clientes, administradores y vendedores) el acceso a funcionalidades clave, tales como:

Gestión de Vehículos:
Permite el registro, consulta, actualización y eliminación de vehículos en el catálogo. Cada vehículo tiene atributos esenciales como marca, modelo, año, precio, estado (nuevo/usado) y disponibilidad para compra o alquiler según el propietario decida.

Gestión de Usuarios:
Proporciona mecanismos de registro, autenticación y administración de perfiles de clientes, administradores y vendedores.

Operaciones de Compraventa y Alquiler:
Facilita la realización de operaciones, permitiendo a los usuarios:

Consultar y comparar vehículos disponibles.
Realizar solicitudes de compra o alquiler.

La API se ha desarrollado siguiendo los principios REST, utilizando los métodos HTTP para implementar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar). 
