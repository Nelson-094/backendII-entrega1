# E-commerce Backend - Desarrollo Avanzado Backend

## 📋 Descripción

API REST de e-commerce con arquitectura profesional implementando patrones de diseño DAO, Repository y DTO, autenticación JWT con Passport, autorización por roles, lógica de compra con tickets, y recuperación de contraseña por email.

## 🏗️ Arquitectura

```
src/
├── config/                # Configuración (DB, Passport, Variables de entorno)
│   ├── config.js
│   ├── database.js
│   └── passport.js
├── controllers/           # Capa Controller (recibe HTTP, usa Repositories + DTOs)
│   ├── cartController.js
│   ├── productController.js
│   ├── sessionController.js
│   └── userController.js
├── dao/                   # Capa DAO (acceso directo a Mongoose)
│   ├── CartDAO.js
│   ├── ProductDAO.js
│   ├── TicketDAO.js
│   └── UserDAO.js
├── dto/                   # Capa DTO (filtrado de datos sensibles)
│   ├── CartDTO.js
│   ├── ProductDTO.js
│   └── UserDTO.js
├── middleware/            # Middlewares (Auth, Roles, Errores)
│   ├── auth.js
│   └── errorHandler.js
├── models/                # Modelos Mongoose
│   ├── Cart.js
│   ├── Product.js
│   ├── Ticket.js
│   └── User.js
├── repositories/          # Capa Repository (lógica de negocio)
│   ├── CartRepository.js
│   ├── ProductRepository.js
│   └── UserRepository.js
├── routes/                # Rutas Express
│   ├── carts.js
│   ├── index.js
│   ├── products.js
│   ├── sessions.js
│   └── users.js
├── utils/                 # Utilidades
│   ├── jwt.js
│   └── mailer.js
├── app.js                 # Configuración Express
└── server.js              # Punto de entrada
```

## 🔧 Patrones de Diseño Implementados

### DAO (Data Access Object)
Los DAOs encapsulan el acceso a la base de datos (Mongoose), separándolo de la lógica de negocio:
- `ProductDAO` - CRUD de productos con paginación
- `CartDAO` - Gestión de carritos
- `UserDAO` - Gestión de usuarios
- `TicketDAO` - Gestión de tickets de compra

### Repository
Los Repositories contienen la lógica de negocio y trabajan con los DAOs:
- `ProductRepository` - Operaciones de productos
- `CartRepository` - Carrito + **lógica de compra** (verificación de stock, generación de tickets)
- `UserRepository` - Usuarios + creación automática de carrito al registrar

### DTO (Data Transfer Object)
Los DTOs filtran la información antes de enviarla al cliente:
- `UserDTO` - Excluye password y datos sensibles
- `ProductDTO` - Formato limpio de productos
- `CartDTO` - Formato de carrito con productos

## 🔐 Autenticación y Autorización

- **JWT** con Passport (estrategias `jwt` y `current`)
- **bcrypt** para encriptación de contraseñas
- **Middleware de roles**:
  - `isAdmin` - Solo administradores (CRUD de productos)
  - `isUser` - Solo usuarios regulares (agregar al carrito, comprar)
  - `isOwnerOrAdmin` - Dueño del recurso o admin (editar perfil)

## 🛒 Lógica de Compra

`POST /api/carts/:cid/purchase`

1. Obtiene el carrito con productos populados
2. Verifica stock de cada producto
3. Productos con stock: se descuenta y se suman al total
4. Productos sin stock: permanecen en el carrito
5. Genera un `Ticket` con código único (UUID), monto total y email del comprador
6. Devuelve el ticket + IDs de productos no procesados

## 📧 Recuperación de Contraseña

- `POST /api/sessions/forgot-password` - Envía email con enlace de recuperación
- `POST /api/sessions/reset-password` - Restablece la contraseña con token
- El enlace expira en **1 hora**
- No permite reutilizar la misma contraseña anterior

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/Nelson-094/backendII-entrega1.git
cd backendII-entrega1

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm run dev
```

## 🔑 Endpoints

### Sessions
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/sessions/register` | Público | Registrar usuario |
| POST | `/api/sessions/login` | Público | Login + JWT |
| GET | `/api/sessions/current` | JWT | Usuario actual (DTO) |
| POST | `/api/sessions/forgot-password` | Público | Solicitar recuperación |
| POST | `/api/sessions/reset-password` | Público | Restablecer contraseña |

### Users
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/users` | Admin | Listar usuarios |
| GET | `/api/users/:id` | JWT | Ver usuario |
| PUT | `/api/users/:id` | Owner/Admin | Editar usuario |
| DELETE | `/api/users/:id` | Admin | Eliminar usuario |

### Products
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/products` | Público | Listar productos (paginado) |
| GET | `/api/products/:pid` | Público | Ver producto |
| POST | `/api/products` | Admin | Crear producto |
| PUT | `/api/products/:pid` | Admin | Editar producto |
| DELETE | `/api/products/:pid` | Admin | Eliminar producto |

### Carts
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/carts/:cid` | JWT | Ver carrito |
| POST | `/api/carts` | JWT | Crear carrito |
| POST | `/api/carts/:cid/product/:pid` | User | Agregar al carrito |
| DELETE | `/api/carts/:cid/product/:pid` | JWT | Quitar del carrito |
| PUT | `/api/carts/:cid/product/:pid` | JWT | Actualizar cantidad |
| PUT | `/api/carts/:cid` | JWT | Actualizar carrito |
| DELETE | `/api/carts/:cid` | JWT | Vaciar carrito |
| POST | `/api/carts/:cid/purchase` | User | Finalizar compra |

## 🧪 Ejemplo de Uso

```bash
# 1. Registrar admin
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Admin","last_name":"Test","email":"admin@test.com","age":30,"password":"admin123","role":"admin"}'

# 2. Login
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# 3. Crear producto (con token admin)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Notebook","description":"Laptop 15 pulgadas","code":"NB001","price":999,"stock":10,"category":"electronics"}'

# 4. Registrar usuario normal y comprar
# (ver TESTING.md para flujo completo)
```

## 🔧 Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** + **mongoose-paginate-v2**
- **Passport.js** + **passport-jwt** + **jsonwebtoken**
- **bcrypt** - Encriptación de contraseñas
- **nodemailer** - Envío de emails
- **uuid** - Generación de códigos de ticket
- **dotenv** - Variables de entorno
- **express-validator** - Validación de entrada
