const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'cosmetologia'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Rutas
app.get('/api/services', (req, res) => {
    const { id, category, name } = req.query;
    
    let query;
    if (id && category) {
        query = 'SELECT * FROM services WHERE id = ? AND category = ?';
        db.query(query, [id, category], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } else if (name && category) {
        query = 'SELECT * FROM services WHERE name = ? AND category = ?';
        db.query(query, [name, category], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } else if (name) {
        query = 'SELECT * FROM services WHERE name = ?';
        db.query(query, [name], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } else if (category) {
        query = 'SELECT * FROM services WHERE category = ?';
        db.query(query, [category], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } else {
        query = 'SELECT * FROM services';
        db.query(query, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    }
});

app.post('/api/services', (req, res) => {
    const { name, description, price, category, img } = req.body;

    if (!name || name.trim() === '' || name.length > 80) {
        return res.json(['error', 'El nombre del producto no debe estar vacío y no debe de tener más de 80 caracteres']);
    }
    if (!description || description.trim() === '' || description.length > 150) {
        return res.json(['error', 'La descripción del producto no debe estar vacía y no debe de tener más de 150 caracteres']);
    }
    if (!price || isNaN(price) || price.length > 20) {
        return res.json(['error', 'El precio del producto no debe estar vacío, debe ser de tipo numérico y no tener más de 20 caracteres']);
    }

    const query = 'INSERT INTO services (name, description, price, category, img) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, price, category, img], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json(['success', 'Producto guardado', { id: results.insertId, name, description, price, category, img }]);
    });
});

app.put('/api/services/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;

    if (!id) {
        return res.json(['error', 'El ID del producto no debe estar vacío']);
    }
    if (!name || name.trim() === '' || name.length > 80) {
        return res.json(['error', 'El nombre del producto no debe estar vacío y no debe de tener más de 80 caracteres']);
    }
    if (!description || description.trim() === '' || description.length > 150) {
        return res.json(['error', 'La descripción del producto no debe estar vacía y no debe de tener más de 150 caracteres']);
    }
    if (!price || isNaN(price) || price.length > 20) {
        return res.json(['error', 'El precio del producto no debe estar vacío, debe ser de tipo numérico y no tener más de 20 caracteres']);
    }

    const query = 'UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?';
    db.query(query, [name, description, price, id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) {
            return res.json(['error', 'No existe el producto con ID ' + id]);
        }
        res.json(['success', 'Producto actualizado']);
    });
});

app.delete('/api/services/:id', (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.json(['error', 'El ID del producto no debe estar vacío']);
    }

    const query = 'DELETE FROM services WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) {
            return res.json(['error', 'No existe el producto con ID ' + id]);
        }
        res.json(['success', 'Producto eliminado']);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
