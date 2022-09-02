const { format } = require("timeago.js");

// La funcion tiene que ser accedida por la vista
// Este helpres va a ser utilizado por la vista de hbs (mirar el index.js)
const helpers = {};

// timeago recibe un timestamp (esa fecha ilegible q guarda mysql 'aaaa-MM-dd HH:mm:ss')
helpers.timeago = () => {
  helpers.timeago = (timestamp) => {
    // para recuperar la fecha y convertirlo en formato de "Publicado hace 2 minutos"
    return format(timestamp);
  };
};

module.exports = helpers;
