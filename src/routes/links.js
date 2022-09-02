const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");

const pool = require("../database");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add");
});

//todo Resumen del post: Cuando el usuario se loguee y guarde una tarea
//todo su id de su sescion sera almacenado junto con la tarea

//todo Resumen del get: Cuando queremos ver sus tareas
//todo vamos a tener que hacer la consulta de los enlaces
//todo que pertenece a ese usuario tan solamente

router.post("/add", isLoggedIn, (req, res) => {
  // <- La función middleware ya no es async
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    // este dato relaciona la tarjeta q agregamos con el id del usuario
    // Este es el parametro que le habiamos dado a la tabla links
    // que a su vez se asocia a la de users
    user_id: req.user.id,
  };
  pool.query("INSERT INTO links set ?", [newLink], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).send("error");
    }
    // al utilizar flash como un middleware, lo tenemos disponible desde req
    req.flash("success", "Link saved successfully");
    return res.redirect("/links");
  });
});

router.get("/", isLoggedIn, async (req, res) => {
  //* Normalmente la consulta sin relaciones la hariamos asi
  //* const links = await pool.query("SELECT * FROM links");
  //* Pero al momento de relacionarla con un usuario la hacemos asi:
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [
    req.user.id,
  ]);
  console.log(links);
  // le decimos que renderice (que muestre) lo que hay en el hbs de links/list
  res.render("links/list", { links });
});

// DELETE
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  // recuperamos el id
  const { id } = req.params;
  // query para eliminar
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success", "Link removed successfully");
  // redireccionamos a la misma vista
  res.redirect("/links");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
  res.render("links/edit", { link: links[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };
  console.log(newLink);
  // UPDATE links: actualiza desde la tabla links
  // set ? WHERE id = ?: el siguiente conjunto de datos donde coincida con el id
  // le paso ese conjunto de datos y el id.. para que compare
  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  req.flash("success", "Link updated successfully");
  res.redirect("/links");
});

module.exports = router;
