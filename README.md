# SneakR



// Route GET pour récupérer toutes les sneakers ou filtrer par IDs
app.get('/sneakrs', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // Page par défaut : 1
    const limit = parseInt(req.query.limit, 10) || 50; // Limite par défaut : 50
    const offset = (page - 1) * limit;
    const ids = req.query.ids ? req.query.ids.split(',') : null;

    let query = 'SELECT * FROM sneakers';
    let queryParams = [];

    if (ids) {
        query += ' WHERE id IN (?)';
        queryParams.push(ids);
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
            return;
        }
        
        res.json({ data: results }); // Pas besoin des infos de pagination quand on filtre par IDs
        


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

    pool.execute(query, queryParams, (err, results) => {
        if (err) {
          console.error('Erreur lors de la récupération des sneakers:', err);
          return res.status(500).json({ error: 'Erreur lors de la récupération des sneakers' });
        }
        res.json({ data: results });
    });
});