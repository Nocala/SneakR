const express = require('express');
const cors = require('cors')
const mysql = require('mysql2');

const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Fonction pour vérifier le rôle
const verifyRole = (requiredRole) => {
    return (req, res, next) => {
      // Vérification du token dans l'en-tête Authorization
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }
  
      // Vérification du token
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Token invalide' });
        }
  
        // Vérification si le rôle dans le token correspond à celui requis
        if (decoded.role !== requiredRole) {
          return res.status(403).json({ error: 'Accès interdit, rôle insuffisant' });
        }
  
        // Ajoute les informations de l'utilisateur à la requête pour pouvoir y accéder dans les autres routes
        req.user = decoded;
  
        // Passer au prochain middleware ou à la route
        next();
      });
    };
  };

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

// Route pour créer un utilisateur (register)
app.post('/users', (req, res) => {
    const { username, password, email } = req.body;

    // Validation des données
    if (!username || !password || !email) {
        res.status(400).json({ error: 'Les champs username, password et email sont requis.' });
        return;
    }

    // Vérification si le username existe déjà
    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification du username :', err);
            res.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }

        if (results.length > 0) {
            res.status(409).json({ error: 'Le username est déjà utilisé.' });
            return;
        }

        // Vérification si l'email existe déjà
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification de l\'email :', err);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return;
            }

            if (results.length > 0) {
                res.status(409).json({ error: 'L\'email est déjà utilisé.' });
                return;
            }

            // Si le username et l'email sont uniques, on continue avec l'insertion
            const bcrypt = require('bcryptjs');
            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('Erreur lors du hachage du mot de passe :', err);
                    res.status(500).json({ error: 'Erreur interne du serveur.' });
                    return;
                }

                // Requête SQL pour insérer un utilisateur
                const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
                db.query(query, [username, hashedPassword, email], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la création de l\'utilisateur :', err);
                        res.status(500).json({ error: 'Erreur interne du serveur.' });
                        return;
                    }

                    res.status(201).json({
                        message: 'Utilisateur créé avec succès.',
                        userId: results.insertId, // ID de l'utilisateur créé
                    });
                });
            });
        });
    });
});


// Route pour se connecter
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    // Vérifie le mot de passe
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de vérification du mot de passe' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      // Ajoute le rôle de l'utilisateur dans le payload
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,  // Ajoute le rôle ici
      };

      // Génère le token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      // Envoie le token et l'ID de l'utilisateur au client
      res.json({ token, userId: user.id });
    });
  });
});

// Route pour récupérer tous les utilisateurs
app.get('/users', verifyRole('admin'), (req, res) => {
    const query = 'SELECT id, username, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
            return;
        }
        res.json(results);
    });
});

app.post('/users', verifyRole('admin'), (req, res) => {
    const { username, password, email, role } = req.body;

    // Validation des données
    if (!username || !password || !email || !role) {
        res.status(400).json({ error: 'Les champs username, password, email et role sont requis.' });
        return;
    }

    // Vérification si le username existe déjà
    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification du username :', err);
            res.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }

        if (results.length > 0) {
            res.status(409).json({ error: 'Le username est déjà utilisé.' });
            return;
        }

        // Vérification si l'email existe déjà
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification de l\'email :', err);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return;
            }

            if (results.length > 0) {
                res.status(409).json({ error: 'L\'email est déjà utilisé.' });
                return;
            }

            // Si le username et l'email sont uniques, on continue avec l'insertion
            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('Erreur lors du hachage du mot de passe :', err);
                    res.status(500).json({ error: 'Erreur interne du serveur.' });
                    return;
                }

                // Requête SQL pour insérer un utilisateur
                const query = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
                db.query(query, [username, hashedPassword, email, role], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la création de l\'utilisateur :', err);
                        res.status(500).json({ error: 'Erreur interne du serveur.' });
                        return;
                    }

                    res.status(201).json({
                        message: 'Utilisateur créé avec succès.',
                        id: results.insertId, // ID de l'utilisateur créé
                    });
                });
            });
        });
    });
});

// Route pour modifier un utilisateur
app.put('/users/:id', verifyRole('admin'), (req, res) => {
    const userId = req.params.id;
    const { username, email, role, password } = req.body;

    // Validation des données
    if (!username || !email || !role) {
        res.status(400).json({ error: 'Les champs username, email et role sont requis.' });
        return;
    }

    const updateUser = () => {
        const query = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';
        db.query(query, [username, email, role, userId], (err, results) => {
            if (err) {
                console.error('Erreur lors de la modification de l\'utilisateur :', err);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }

            res.json({ message: 'Utilisateur modifié avec succès.' });
        });
    };

    if (password) {
        // Si un mot de passe est fourni, le hacher avant de mettre à jour l'utilisateur
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Erreur lors du hachage du mot de passe :', err);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return;
            }

            const query = 'UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE id = ?';
            db.query(query, [username, email, role, hashedPassword, userId], (err, results) => {
                if (err) {
                    console.error('Erreur lors de la modification de l\'utilisateur :', err);
                    res.status(500).json({ error: 'Erreur interne du serveur.' });
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).json({ error: 'Utilisateur non trouvé' });
                    return;
                }

                res.json({ message: 'Utilisateur modifié avec succès.' });
            });
        });
    } else {
        // Si aucun mot de passe n'est fourni, mettre à jour l'utilisateur sans changer le mot de passe
        updateUser();
    }
});

// Route pour supprimer un utilisateur
app.delete('/users/:id', verifyRole('admin'), (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', err);
            res.status(500).json({ error: 'Erreur interne du serveur.' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        res.json({ message: 'Utilisateur supprimé avec succès.' });
    });
});

// Route GET pour récupérer toutes les sneakers
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
  
    if (!user_id || !sneaker_id) {
      return res.status(400).json({ error: 'User ID and Sneaker ID are required' });
    }
  
    const query = 'INSERT INTO wishlist (user_id, sneaker_id) VALUES (?, ?)';
    db.query(query, [user_id, sneaker_id], (err, results) => {
      if (err) {
        console.error('Error inserting into wishlist:', err);
        return res.status(500).json({ error: 'Failed to add to wishlist' });
      }
      res.status(201).json({ message: 'Sneaker added to wishlist', results });
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