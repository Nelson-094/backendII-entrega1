# Ecommerce Authentication System

Sistema de autenticación y autorización para ecommerce con CRUD de usuarios, implementado con Node.js, Express, MongoDB, JWT y Passport.

## 🚀 Características

- ✅ **Modelo de Usuario** con todos los campos requeridos
- ✅ **Encriptación de contraseñas** con bcrypt.hashSync
- ✅ **Autenticación JWT** con Passport strategies
- ✅ **Autorización basada en roles** (user/admin)
- ✅ **CRUD completo de usuarios**
- ✅ **Endpoint /current** para validar usuario logueado

## 📋 Requisitos

- Node.js 16 o superior
- MongoDB (local o MongoDB Atlas)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd emerald-schrodinger
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Copiar el archivo `.env.example` a `.env` y configurar:
   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus valores:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=tu_clave_secreta_super_segura
   JWT_EXPIRES_IN=24h
   ```

4. **Iniciar el servidor**
   
   Desarrollo:
   ```bash
   npm run dev
   ```
   
   Producción:
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Sessions (Autenticación)

#### Registrar Usuario
```http
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123",
  "role": "user"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "age": 25,
      "role": "user",
      "cart": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Obtener Usuario Actual (Current)
```http
GET /api/sessions/current
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "User validated successfully",
  "data": {
    "user": {
      "id": "...",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "age": 25,
      "role": "user",
      "cart": { ... }
    }
  }
}
```

### Users (CRUD)

#### Obtener Todos los Usuarios (Admin)
```http
GET /api/users
Authorization: Bearer <admin-token>
```

#### Obtener Usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Actualizar Usuario
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "age": 26
}
```

#### Eliminar Usuario (Admin)
```http
DELETE /api/users/:id
Authorization: Bearer <admin-token>
```

## 🔐 Autenticación y Autorización

### JWT Token

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Después de login o registro, recibirás un token que debes incluir en el header `Authorization` de las peticiones protegidas:

```
Authorization: Bearer <tu-token-jwt>
```

### Passport Strategies

1. **JWT Strategy**: Valida el token y recupera el usuario
2. **Current Strategy**: Específica para el endpoint `/api/sessions/current`, valida el token y devuelve los datos del usuario

### Roles

- **user**: Usuario normal (por defecto)
- **admin**: Administrador con permisos especiales

### Permisos

| Endpoint | user | admin |
|----------|------|-------|
| POST /api/sessions/register | ✅ | ✅ |
| POST /api/sessions/login | ✅ | ✅ |
| GET /api/sessions/current | ✅ | ✅ |
| GET /api/users | ❌ | ✅ |
| GET /api/users/:id | ✅ | ✅ |
| PUT /api/users/:id | ✅ (solo propio) | ✅ |
| DELETE /api/users/:id | ❌ | ✅ |

## 🗄️ Modelos de Datos

### User
```javascript
{
  first_name: String,
  last_name: String,
  email: String (único),
  age: Number,
  password: String (hash con bcrypt),
  cart: ObjectId (referencia a Cart),
  role: String (default: 'user')
}
```

### Cart
```javascript
{
  products: [{
    product: ObjectId (referencia a Product),
    quantity: Number
  }]
}
```

### Product
```javascript
{
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  thumbnails: [String],
  status: Boolean
}
```

## 🧪 Pruebas con Postman/Thunder Client

1. **Registrar un usuario**
2. **Copiar el token** de la respuesta
3. **Usar el token** en el header Authorization para endpoints protegidos
4. **Probar /api/sessions/current** para validar el token

## 🛡️ Seguridad

- ✅ Contraseñas encriptadas con **bcrypt.hashSync** (10 salt rounds)
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de entrada con express-validator
- ✅ Protección de rutas con Passport JWT
- ✅ Control de acceso basado en roles
- ✅ Emails únicos en la base de datos

## 📁 Estructura del Proyecto

```
emerald-schrodinger/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración MongoDB
│   │   └── passport.js      # Estrategias Passport (JWT y Current)
│   ├── controllers/
│   │   ├── sessionController.js  # Register, Login, Current
│   │   └── userController.js     # CRUD usuarios
│   ├── middleware/
│   │   ├── auth.js          # Autenticación y autorización
│   │   └── errorHandler.js  # Manejo de errores
│   ├── models/
│   │   ├── User.js          # Modelo Usuario (con bcrypt)
│   │   ├── Cart.js          # Modelo Carrito
│   │   └── Product.js       # Modelo Producto
│   ├── routes/
│   │   ├── sessions.js      # Rutas de autenticación
│   │   ├── users.js         # Rutas CRUD usuarios
│   │   └── index.js         # Router principal
│   ├── utils/
│   │   └── jwt.js           # Utilidades JWT
│   ├── app.js               # Configuración Express
│   └── server.js            # Punto de entrada
├── .env.example             # Plantilla variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🎯 Criterios de Evaluación Cumplidos

✅ **Modelo de Usuario y Encriptación**: User model con todos los campos + bcrypt.hashSync  
✅ **Estrategias de Passport**: JWT strategy y "current" strategy implementadas  
✅ **Sistema de Login**: Login con generación de JWT válido  
✅ **Endpoint /current**: Valida usuario logueado y devuelve datos del JWT  

## 👨‍💻 Autor

Proyecto desarrollado para la entrega N°1 del curso de Backend.

## 📄 Licencia

ISC
