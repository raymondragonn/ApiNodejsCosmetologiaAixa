const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // Requiere el paquete cors
// const connectDB = require('./db');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const serviceRouter = require('./routes/serviceRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(express.json());


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/users', userRouter);


//Es importante el orden de los middleware por eso es que el manejo de las rutas esta hasta el final
//Manejar la rutas que no existen 
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));//si le pasas algo a next asume que es un error y se salta todos lo middleware en el stack
});

//error handling middleware esta funcion express sabe que es especial para errores 
app.use(globalErrorHandler);


// connectDB();

// // Configuración de la conexión a la base de datos
// const db = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'root',
//     database: 'cosmetologia'
// });

// // Conectar a la base de datos
// db.connect((err) => {
//     if (err) throw err;
//     console.log('Conectado a la base de datos MySQL');
// });

// // Definir el esquema de Mongoose para los servicios
// const serviceSchema = new mongoose.Schema({
//     name: { type: String, required: true, maxlength: 80 },
//     description: { type: String, required: true, maxlength: 150 },
//     price: { type: Number, required: true, max: 1e6 },
//     category: String,
//     img: String
//   });

// const Service = mongoose.model('Service', serviceSchema);

// Middleware para permitir CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
// });

// // Rutas
// app.get('/api/services', async (req, res) => {
//     try {
//       const { id, category, name } = req.query;
//       let query = {};
  
//       if (id) query._id = id;
//       if (category) query.category = category;
//       if (name) query.name = name;
  
//       const services = await Service.find(query);
//       res.json(services);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   app.post('/api/services', async (req, res) => {
//     try {
//       const { name, description, price, category, img } = req.body;
  
//       if (!name || name.trim() === '' || name.length > 80) {
//         return res.json(['error', 'El nombre del producto no debe estar vacío y no debe de tener más de 80 caracteres']);
//       }
//       if (!description || description.trim() === '' || description.length > 150) {
//         return res.json(['error', 'La descripción del producto no debe estar vacía y no debe de tener más de 150 caracteres']);
//       }
//       if (!price || isNaN(price) || price.length > 20) {
//         return res.json(['error', 'El precio del producto no debe estar vacío, debe ser de tipo numérico y no tener más de 20 caracteres']);
//       }
  
//       const newService = new Service({ name, description, price, category, img });
//       await newService.save();
//       res.status(201).json(['success', 'Producto guardado', newService]);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   app.put('/api/services/:id', async (req, res) => {
//     try {
//       const id = req.params.id;
//       const { name, description, price } = req.body;
  
//       if (!name || name.trim() === '' || name.length > 80) {
//         return res.json(['error', 'El nombre del producto no debe estar vacío y no debe de tener más de 80 caracteres']);
//       }
//       if (!description || description.trim() === '' || description.length > 150) {
//         return res.json(['error', 'La descripción del producto no debe estar vacía y no debe de tener más de 150 caracteres']);
//       }
//       if (!price || isNaN(price) || price.length > 20) {
//         return res.json(['error', 'El precio del producto no debe estar vacío, debe ser de tipo numérico y no tener más de 20 caracteres']);
//       }
  
//       const updatedService = await Service.findByIdAndUpdate(id, { name, description, price }, { new: true });
//       if (!updatedService) {
//         return res.json(['error', 'No existe el producto con ID ' + id]);
//       }
//       res.json(['success', 'Producto actualizado', updatedService]);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   app.delete('/api/services/:id', async (req, res) => {
//     try {
//       const id = req.params.id;
//       const deletedService = await Service.findByIdAndDelete(id);
  
//       if (!deletedService) {
//         return res.json(['error', 'No existe el producto con ID ' + id]);
//       }
//       res.json(['success', 'Producto eliminado']);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   // Iniciar el servidor
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
//   });



module.exports = app;
