const mongoose = require('mongoose');

// URL de conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/tu_nombre_base_datos';
/* ULR de conexión a MongoDB Atlas
const mongoURI = 'mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/tu_nombre_base_datos?retryWrites=true&w=majority';*/


const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
