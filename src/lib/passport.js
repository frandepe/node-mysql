// passport permite hacer autenticaciones a travez de redes sociales
// en este caso lo vamos a hacer de manera local

const passport = require("passport");
const LocalStrategy = require("passport-local");
const pool = require("../database");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      // comprobamos si el usuario existe para loguearlo
      const rows = await pool.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user, req.flash("success", "Welcome" + user.username));
        } else {
          done(null, false, req.flash("message", "Incorrect password"));
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "The username does not exists")
        );
      }
    }
  )
);

// local.signup es un nombre inventado
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      // username y password son los datos que estoy enviando (el name)
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        username,
        password,
        fullname,
      };
      // toma una contraseña y la cifra
      newUser.password = await helpers.encryptPassword(password);
      // para insertar este nuevo usuario en la base de datos
      const result = await pool.query("INSERT INTO users SET ?", [newUser]);
      newUser.id = result.insertId;
      // null para decir q no hay error, y newUser para q lo almacene en sesion
      return done(null, newUser);
    }
  )
);

//*Cuadno serializo estoy guardando el id del usuario
passport.serializeUser((user, done) => {
  // gracias al id vamos a guardarlo en sesion
  done(null, user.id);
});

//*Cuando deserializo, estoy tomando ese aid guardado para obtener los datos
// necesito el id del usuario y done para continuar con el resto de codigo
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM users Where id = ?", [id]);
  done(null, rows[0]);
});
