const express = require("express");
const router = express.Router();
const { User } = require("../models/users");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/* GET Listar els categorías */
router.get("/", async (req, res) => {
  const lista = await User.find().select("-passwordHash");
  if (!lista) {
    return res.status(400).json({ message: "No hay usuarios" });
  }
  return res.status(200).json(lista);
});
// GET obtener usuario por su id
router.get("/:id", async (req, res) => {
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  const usuario = await User.findById(id).select("-passwordHash");
  if (!usuario) {
    return res.status(400).json({ message: "No existe el usuario" });
  }
  return res.status(200).json(usuario);
});
// POST crear usuario
router.post("/register", async (req, res) => {
  const usuario = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    photo: req.body.photo,
    isAdmin: req.body.isAdmin,
  });
  await usuario.save();
  return res.status(200).json(usuario);
});
// PUT actualizar usuario
router.put("/:id", async (req, res) => {
  const usuarioviejo = await User.findById();
  let newpass;
  if (req.params.password) {
    newpass = bcrypt.hashSync(req.params.password, 10);
  } else {
    newpass = usuarioviejo.passwordHash;
  }
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }

  const usuario = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newpass,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      photo: req.body.photo,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );
  // si no se actualizo
  if (!usuario) {
    return res.status(400).json({ message: "No existe el usuario" });
  }
  // DELETE eliminar usuario
  router.delete("/:id", async (req, res) => {
    // validar que es válido el ID
    let id = null;
    if (isValidObjectId(req.params.id)) {
      id = req.params.id;
    }
    const usuario = await User.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(400).json({ message: "No existe el usuario" });
    }
    return res.status(200).json(usuario);
  });
});
// ruta de login
router.post("/login", async (req, res) => {
  const usuario = await User.findOne({ email: req.body.email });
  if (!usuario) {
    return res.status(400).json({ message: "El usuario no existe" });
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    usuario.passwordHash
  );
  if (!validPassword) {
    return res.status(400).json({ message: "Contraseña incorrecta" });
  }
  const token = jwt.sign(
    {
      userId: usuario.id,
      isAdmin: usuario.isAdmin,
    },
    "secret",
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    message: "Se realizo el login correctamente",
    user: usuario.email,
    token: token,
  });
});
router.get("get/count", async (req, res) => {
  const userCount = User.countDocuments((count) => count);
  if (!userCount) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({
    message: "Usuarios totales",
    userCount: userCount,
  });
});

module.exports = router;
