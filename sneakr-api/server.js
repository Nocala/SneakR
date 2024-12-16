const express = require('express');
const cors = require('cors')
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sneakr',
    database: 'SneakR',
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données');
});

app.get('/sneakrs', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // Page par défaut : 1
    const limit = parseInt(req.query.limit, 10) || 50; // Limite par défaut : 16
    const offset = (page - 1) * limit;
 
    const query = 'SELECT * FROM sneakers LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
            return;
        }
 
        // Comptage total des produits pour la pagination
        const countQuery = 'SELECT COUNT(*) AS total FROM sneakers';
        db.query(countQuery, (countErr, countResults) => {
            if (countErr) {
                console.error('Erreur lors du comptage des produits:', countErr);
                res.status(500).json({ error: 'Erreur lors du comptage des produits' });
                return;
            }
 
            const total = countResults[0].total;
            const totalPages = Math.ceil(total / limit);
 
            res.json({
                data: results,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                },
            });
        });
    });
});

// Route GET pour récupérer tous les items de la collection
app.get('/collection', (req, res) => {
    const query = 'SELECT * FROM collection';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des collections:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des collections' });
            return;
        }
        res.json(results);
    });
});

// Route POST pour ajouter un nouvel item à la collection
app.post('/collection', (req, res) => {
    const { user_id, sneaker_id } = req.body;
    const query = 'INSERT INTO collection (user_id, sneaker_id) VALUES (?, ?)';
    db.query(query, [user_id, sneaker_id], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la collection:', err);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de la collection' });
            return;
        }
        res.status(201).json({ id: results.insertId, user_id, sneaker_id });
    });
});

// Route DELETE pour supprimer un item de la collection
app.delete('/collection/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM collection WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de la collection:', err);
            res.status(500).json({ error: 'Erreur lors de la suppression de la collection' });
            return;
        }
        res.json({ id });
    });
});

// Route GET pour récupérer tous les items de la wishlist
app.get('/wishlist', (req, res) => {
    const query = 'SELECT * FROM wishlist';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la wishlist:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la wishlist' });
            return;
        }
        res.json(results);
    });
});

// Route POST pour ajouter un nouvel item à la wishlist
app.post('/wishlist', (req, res) => {
    const { user_id, sneaker_id } = req.body;
    const query = 'INSERT INTO wishlist (user_id, sneaker_id) VALUES (?, ?)';
    db.query(query, [user_id, sneaker_id], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout à la wishlist:', err);
            res.status(500).json({ error: 'Erreur lors de l\'ajout à la wishlist' });
            return;
        }
        res.status(201).json({ id: results.insertId, user_id, sneaker_id });
    });
});

// Route DELETE pour supprimer un item de la wishlist
app.delete('/wishlist/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM wishlist WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de la wishlist:', err);
            res.status(500).json({ error: 'Erreur lors de la suppression de la wishlist' });
            return;
        }
        res.json({ id });
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});