module.exports = {
  isLoggedIn(req, res, next) {
    // is authenticated es un metodo de passport que me devuelve un true
    // si la sesion del usuario existe
    // esto lo podemos usar para hacer rutas privadas
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/signin");
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/profile");
  },
};
