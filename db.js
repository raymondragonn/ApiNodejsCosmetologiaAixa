const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas conectado exitosamente...');
    } catch (err) {
        console.error('Error de conexión a MongoDB Atlas:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;