// Importation de mysql2 pour gérer le pool de connexions
const mysql = require('mysql2');

// Créer un pool de connexions à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || 'sneakr',
  database: process.env.DB_NAME || 'SneakR', 
  waitForConnections: true, // Attendre une connexion libre si le nombre maximum de connexions est atteint
  connectionLimit: 10, // Nombre maximal de connexions ouvertes en même temps
  queueLimit: 0 
});

// Exporter le pool de connexions pour qu'il puisse être utilisé ailleurs dans le projet
module.exports = pool;