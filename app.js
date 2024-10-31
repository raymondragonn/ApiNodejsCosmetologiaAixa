const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
const connectDB = require('./db');
=======
const morgan = require('morgan');
// const connectDB = require('./db');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const serviceRouter = require('./routes/serviceRoutes');
>>>>>>> 1ae29c7e4db6761129f3ad845bb1083bf16b726d

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json());


<<<<<<< HEAD
// Esquema de Mongoose actualizado para los servicios
const serviceSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true, maxlength: 80 },
    description: { type: String, required: true, maxlength: 250 },
    price: { type: Number, required: true, max: 1e6 },
    category: { type: String, required: true },
    img1: { type: String, required: true },
    img2: { type: String, required: true },
    information: { type: String, required: true, maxlength: 250 }
});

const Service = mongoose.model('Service', serviceSchema);

// Middleware para CORS
=======
>>>>>>> 1ae29c7e4db6761129f3ad845bb1083bf16b726d
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

<<<<<<< HEAD
// Rutas actualizadas

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/api/services', async (req, res) => {
    try {
        const { id, category, name } = req.query;
        let query = {};

        if (id) query.id = id;
        if (category) query.category = category;
        if (name) query.name = name;

        const services = await Service.find(query);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const { id, name, description, price, category, img1, img2, information } = req.body;

        // Validaciones actualizadas
        if (!name || name.trim() === '' || name.length > 80) {
            return res.json(['error', 'El nombre del servicio no debe estar vacío y no debe de tener más de 80 caracteres']);
        }
        if (!description || description.trim() === '' || description.length > 250) {
            return res.json(['error', 'La descripción del servicio no debe estar vacía y no debe de tener más de 250 caracteres']);
        }
        if (!price || isNaN(price) || price > 1e6) {
            return res.json(['error', 'El precio del servicio debe ser un número válido y no mayor a 1,000,000']);
        }
        if (!information || information.trim() === '' || information.length > 250) {
            return res.json(['error', 'La información del servicio no debe estar vacía y no debe de tener más de 250 caracteres']);
        }
        if (!img1 || !img2) {
            return res.json(['error', 'Se requieren ambas imágenes para el servicio']);
        }
        if (!category) {
            return res.json(['error', 'La categoría es requerida']);
        }

        const newService = new Service({
            id,
            name,
            description,
            price,
            category,
            img1,
            img2,
            information
        });

        await newService.save();
        res.status(201).json(['success', 'Servicio guardado', newService]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/services/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { name, description, price, img1, img2, information } = req.body;

        // Validaciones actualizadas
        if (!name || name.trim() === '' || name.length > 80) {
            return res.json(['error', 'El nombre del servicio no debe estar vacío y no debe de tener más de 80 caracteres']);
        }
        if (!description || description.trim() === '' || description.length > 250) {
            return res.json(['error', 'La descripción del servicio no debe estar vacía y no debe de tener más de 250 caracteres']);
        }
        if (!price || isNaN(price) || price > 1e6) {
            return res.json(['error', 'El precio del servicio debe ser un número válido y no mayor a 1,000,000']);
        }
        if (!information || information.trim() === '' || information.length > 250) {
            return res.json(['error', 'La información del servicio no debe estar vacía y no debe de tener más de 250 caracteres']);
        }

        const updatedService = await Service.findOneAndUpdate(
            { id: serviceId },
            {
                name,
                description,
                price,
                img1,
                img2,
                information
            },
            { new: true }
        );

        if (!updatedService) {
            return res.json(['error', 'No existe el servicio con ID ' + serviceId]);
        }
        res.json(['success', 'Servicio actualizado', updatedService]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findOneAndDelete({ id: serviceId });

        if (!deletedService) {
            return res.json(['error', 'No existe el servicio con ID ' + serviceId]);
        }
        res.json(['success', 'Servicio eliminado']);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
=======

app.use('/api/v1/services', serviceRouter);


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

// // Middleware para permitir CORS
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
>>>>>>> 1ae29c7e4db6761129f3ad845bb1083bf16b726d
