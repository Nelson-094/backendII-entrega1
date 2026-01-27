import app from './app.js';
import connectDB from './config/database.js';
import { config } from './config/config.js';

// Configuration
const PORT = config.port;

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 API available at http://localhost:${PORT}/api`);
            console.log(`\n📚 Available endpoints:`);
            console.log(`   POST   /api/sessions/register - Register new user`);
            console.log(`   POST   /api/sessions/login    - Login user`);
            console.log(`   GET    /api/sessions/current  - Get current user (JWT required)`);
            console.log(`   GET    /api/users             - Get all users (Admin only)`);
            console.log(`   GET    /api/users/:id         - Get user by ID`);
            console.log(`   PUT    /api/users/:id         - Update user`);
            console.log(`   DELETE /api/users/:id         - Delete user (Admin only)`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
