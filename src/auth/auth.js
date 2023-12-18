/* Authentification : Créer un modèle User avec Sequelize */
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  
  // Si l'utilisateur ne fourni pas de jeton on retourne un message d'erreur
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message })
  }
    
    // Ici on récupère le jeton de l'utilisateur dans une const token, on récupère seulement la valeur du jeton dans l'entête http authorization qui vient avec un nom arbitraire dont on a pas besoin. Cela permet d'extraire dans cet entête uniquement la valeur du jeton de l'utilisateur dans on a besoin.
    // Une fois cela fait cela nous permet de verifier le jeton avec la méthode verify 
    const token = authorizationHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error })
    }
  
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } else {
      // Ici une fois tous les tests passé avec succès on laisse l'utilisateur accéder au point de terminaison demander avec la méthode next
      next()
    }
  })
}

// PS : Le token sera toujours accompagné du mot "Bearer" quand nous devons le transmettre au moment de la requête du point de terminaison en question dans le Header de la requête.