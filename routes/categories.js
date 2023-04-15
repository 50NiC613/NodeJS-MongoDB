const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
/* GET Listar las categorías */
router.get("/", async (req, res) => {
  const lista = await Category.find();
  if (!lista) {
    return res.status(400).json({ message: "No hay categorías" });
  }
  return res.status(200).json(lista);
});
// GET obtener categoria por su id
router.get("/:id", async (req, res) => {
  // validar que es valido el id
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  const categoria = await Category.findById(id);
  if (!categoria) {
    return res.status(400).json({ message: "No existe la categoria" });
  }
  return res.status(200).json(categoria);
});
// POST crear categoria
router.post("/", async (req, res) => {
  const categoria = new Category({
    color: req.body.color,
    icon: req.body.icon,
    name: req.body.name,
  });
  await categoria.save();
  return res.status(200).json({
    success: true,
    category: categoria,
  });
});
// PUT actualizar categoria
router.put("/:id", async (req, res) => {
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }

  const categoria = await Category.findByIdAndUpdate(
    id,
    {
      color: req.body.color,
      icon: req.body.icon,
      Image: req.body.image,
    },
    { new: true }
  );
  // si no se actualizo
  if (!categoria) {
    return res.status(400).json({ message: "No existe la categoria" });
  }
  // DELETE eliminar categoria
  router.delete("/:id", async (req, res) => {
    // validar que es válido el ID
    let id = null;
    if (isValidObjectId(req.params.id)) {
      id = req.params.id;
    }
    const categoria = await Category.findByIdAndDelete(id);
    if (!categoria) {
      return res.status(400).json({ message: "No existe la categoria" });
    }
    return res.status(200).json(categoria);
  });
});
module.exports = router;
