# Configuración del Proyecto de Compra-Venta y Alquiler de Vehículos

## Requisitos Previos

- Node.js y npm instalados
- Cuenta de Mercado Pago
- Cuenta de Gmail
- MongoDB 
- Puerto 3000 liberado (O en su defecto ajustar en index.ts (backend) el puerto que mas le quede cómodo)
- Puerto 4200 liberado (frontend. En caso de que se cambie este puerto. Debe dirigirse a index.ts en backend y actualizar el puerto de la configuración de CORS para evitar inconvenientes)

## Instalación

1. Clonar el repositorio del proyecto:

    ```bash
    git clone https://github.com/BorsatoMilton/tp-dsw-cargarage-backend.git
    git clone https://github.com/BorsatoMilton/tp-dsw-cargarage-frontend.git
    ```

2. Instalar las dependencias en ambos repositorios:

    ```bash
    npm install
    ```


## Configuración de Mercado Pago

1. Crear una cuenta en [Mercado Pago](https://www.mercadopago.com.ar/developers/es).
2. Obtener las credenciales de prueba (Access Token y Public Key) desde el [panel de desarrollador](https://www.mercadopago.com/developers/panel).
3. Crear un archivo `.env` en la raíz del proyecto y agregar las credenciales:

    ```env
    MERCADO_PAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN
    ```

En el archivo enviroments.ts del frontend colocar la public_key otorgada por mercado pago

## Configuración de Envío de Correos con Gmail y OAuth

1. Crear un correo de Gmail.
2. Habilitar la API de Gmail.
3. Configurar la pantalla de consentimiento OAuth y crear credenciales OAuth 2.0.
4. Agregar las credenciales al archivo .env


    ```env
    EMAIL_USER= tu_correo_de_gmail
    EMAIL_PASS= tu_clave_de_gmail
    OAUTH_CLIENT_SECRET= OAUTH_otorgado_por_gmail
    OAUTH_CLIENTID= ClientID_otorgado_por_gmail
    ```

## Configuración de token para validación de rutas en el backend

1. Ubicarse en el archivo .env
2. Crear una clave para las validaciones de rutas

    ```env
        SECRET_KEY_WEBTOKEN=tu_clave
    ```

## Configuracion de entornos extras
1. Crear las variables
URL_MONGO_DB= tu_url_de_base_de_datos
NODE_ENV= development (desarrollo) o production (en caso de usar en ambos ambientes, recomendable crear otro .env.production con las mismas variables)
CLIENT_URL= tu_url_del_cliente


## Carpeta UPLOADS

1. Colocarse en la carpeta SRC del backend
2. Crear una carpeta vacia con el nombre "uploads"

## Ejecutar el Proyecto

1. Iniciar el servidor:

REPOSITORIO BACKEND

    ```bash
    npm run start:dev 
    ```

REPOSITORIO FRONTEND

    ```bash
    ng serve
    ```


2. Acceder a la aplicación desde el frontend o bien en la url `http://localhost:4200`.

