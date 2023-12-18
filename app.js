// Les imports
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')
// const functions = require('firebase-functions')

const app = express()
const port = process.env.PORT || 3000


// 1ère méthode pour définir un middleware
// const logger = (req, res, next) => {
//     console.log(`URL : ${req.url}`);
//     next()
// }

// app.use(logger)

// 2ème méthode plus court pour définir le middleware
// app.use((req, res, next) => {
//     console.log(`URL : ${req.url}`);
//     next()
// })

// Utilisation de morgan pour le middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json())

sequelize.initDb()

app.get('/', (req, res) => {
    res.json("Salut !")
})

// Ici nous placerons nos futurs points de terminaison.
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

// On ajoute la gestion des erreurs 404
app.use(({res}) => {
    const message = `Impossible de trouver la ressource demandé ! Vous pouvez essayer une autre URL.`
    res.status(404).json({message})
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))

// exports.api = functions.https.onRequest(app)