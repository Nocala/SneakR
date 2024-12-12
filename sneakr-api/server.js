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

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

