const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

/* GET Listar los productos */
router.get("/", async function (req, res) {
  let products = await Product.find();
  if (!products.length) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});
/* GET producto por ID */
router.get("/:id", function (req, res) {
  let id = req.params.id;
  let product = products.find((product) => product.id === id);
  res.send(product);
});
// importar modelo de producto

/* POST Crear un nuevo producto */
router.post("/", function (req, res) {
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
  });
  product
    .save(product)
    .then(() => {
      res.status(200).json({
        message: "Product agregado",
        product: product,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        error: err,
      });
    });
});
/* PUT Actualizar un producto */
router.put("/:id", function (req, res) {
  let id = req.params.id;
  let product = products.find((product) => product.id === id);
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.body.image;
  res.send(product);
});
/* DELETE Eliminar un producto */
router.delete("/:id", async function (req, res) {
  await Product.findByIdAndDelete(req.params.id).then((product) => {
    res
      .status(200)
      .json({
        message: "Producto eliminado",
        product: product,
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
          error: err,
        });
      });
  });
});

module.exports = router;
