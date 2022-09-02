const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
// Las sesiones almacenan los datos en la memoria del servidor
// y en la base de datos
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");

const { database } = require("./keys");

// Initializations
const app = express();
require("./lib/passport");

// settings
app.set("port", process.env.PORT || 4000);
//? hay que especificarle dónde se encuentra, en este caso dentro de src.
//? __dirname es una constante de node que devuelve la direccion del archivo que se esta ejecutando
//? y se está concatenando con la carpeta views
app.set("views", path.join(__dirname, "views"));
//? El metodo join lo que hace es unir directorios (en este caso quiero
//? en donde esta la carpeta views con el nombre layouts)
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"), // para darle la direccion donde está esa carpeta
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(
  session({
    secret: "fransqlnodesession",
    resave: false,
    saveUninitialized: false,
    // aca decidimos donde guardar la sesion, en este aso en la propia db
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
//? urlencode Sirve para podes aceptar de los formularios los datos que me envie el usuario
//? extended false no acepta imagenes o datos complejos, solo strings y cosas asi
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//? Con esto estamos iniciando passport
app.use(passport.initialize());
//? Con esto le indicamos la session para q passport guarde los datos
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
  // de esta manera el mensaje success va a estar disponible en todas mis vistas
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  // con esto podemos acceder a los datos del usuario desde cualquier parte, tipo localstorage
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

// Public
//? Con esto le decimos donde está nuestra carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port`, app.get("port"));
});
