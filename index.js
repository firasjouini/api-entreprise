const express = require('express');
const fetch = require('node-fetch');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// 📄 Configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Recherche d’Entreprises',
      version: '1.0.0',
      description: 'API Node.js connectée à data.gouv.fr pour rechercher des entreprises',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'], // fichier où se trouvent les commentaires Swagger
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /api/entreprise:
 *   get:
 *     summary: Recherche une entreprise par nom
 *     parameters:
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         required: true
 *         description: Le nom de l’entreprise à rechercher
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       400:
 *         description: Paramètre manquant
 *       500:
 *         description: Erreur serveur
 */
app.get('/api/entreprise', async (req, res) => {
  const nom = req.query.nom;
  if (!nom) {
    return res.status(400).json({ error: 'Le paramètre "nom" est requis' });
  }

  try {
    const apiUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(nom)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la requête API :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger : http://localhost:${PORT}/api-docs`);
});
