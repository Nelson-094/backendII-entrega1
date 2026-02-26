import app from './app.js';
import connectDB from './config/database.js';
import { config } from './config/config.js';

const PORT = config.port;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 API disponible en http://localhost:${PORT}/api`);
            console.log(`\n📚 Endpoints disponibles:`);
            console.log(`\n   🔐 Sessions:`);
            console.log(`   POST   /api/sessions/register        - Registrar usuario`);
            console.log(`   POST   /api/sessions/login            - Login`);
            console.log(`   GET    /api/sessions/current          - Usuario actual (JWT)`);
            console.log(`   POST   /api/sessions/forgot-password  - Recuperar contraseña`);
            console.log(`   POST   /api/sessions/reset-password   - Restablecer contraseña`);
            console.log(`\n   👤 Users:`);
            console.log(`   GET    /api/users                     - Todos los usuarios (Admin)`);
            console.log(`   GET    /api/users/:id                 - Usuario por ID`);
            console.log(`   PUT    /api/users/:id                 - Actualizar usuario`);
            console.log(`   DELETE /api/users/:id                 - Eliminar usuario (Admin)`);
            console.log(`\n   📦 Products:`);
            console.log(`   GET    /api/products                  - Listar productos`);
            console.log(`   GET    /api/products/:pid             - Producto por ID`);
            console.log(`   POST   /api/products                  - Crear producto (Admin)`);
            console.log(`   PUT    /api/products/:pid             - Actualizar producto (Admin)`);
            console.log(`   DELETE /api/products/:pid             - Eliminar producto (Admin)`);
            console.log(`\n   🛒 Carts:`);
            console.log(`   GET    /api/carts/:cid                - Ver carrito`);
            console.log(`   POST   /api/carts                     - Crear carrito`);
            console.log(`   POST   /api/carts/:cid/product/:pid   - Agregar al carrito (User)`);
            console.log(`   DELETE /api/carts/:cid/product/:pid   - Quitar del carrito`);
            console.log(`   PUT    /api/carts/:cid/product/:pid   - Actualizar cantidad`);
            console.log(`   PUT    /api/carts/:cid                - Actualizar carrito`);
            console.log(`   DELETE /api/carts/:cid                - Vaciar carrito`);
            console.log(`   POST   /api/carts/:cid/purchase       - Comprar carrito (User)`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
