const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { Usuario } = require("../models/users");
//GET Listar usuarios async
router.get("/", async (req, res) => {
  const listaUsuarios = await Usuario.find();
  if (!listaUsuarios)
    res.status(400).json({
      message: "no hay usuarios",
    });
  res.status(200).json({
    message: "Se encontraron los usuarios",
    usuarios: listaUsuarios,
  });
});
// POST Crear usuario async
router.post("/", async (req, res) => {
  const usuario = req.body;
  const usuarioNuevo = await Usuario.create(usuario);
  if (!usuarioNuevo)
    res.status(400).json({
      message: "Error al crear usuario",
    });
  res.status(200).json({
    message: "Se creo el usuario",
    usuario: usuarioNuevo,
  });
});
// PUT Actualizar usuario async
router.put("/:id", async (req, res) => {
  //validar id
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: "El id es invalido" });
  const usuario = req.body;
  const usuarioNuevo = await Usuario.findByIdAndUpdate(req.params.id, usuario, {
    new: true,
  });
  res.status(200).json({
    message: "Se actualizo el usuario",
    usuario: usuarioNuevo,
  });
});
// DELETE Borrar usuario async
router.delete("/:id", async (req, res) => {
  //validar id
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: "El id es invalido" });
  const usuario = await Usuario.findByIdAndRemove(req.params.id);
  if (!usuario) res.status(400).json({ message: "El usuario no existe" });
  res.status(200).json({ message: "Se borró el usuario" });
});
module.exports = router;
