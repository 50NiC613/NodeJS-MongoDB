const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { Product } = require("../models/product");

/* GET Listar los productos
 */

router.get("/", async (req, res) => {
  let products = await Product.find();
  if (!products.length) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});
/* GET producto por ID */
router.get("/:id", async (req, res) => {
  // validar que es valido el id
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  let product = await Product.findById(id);
  if (product) {
    res.status(200).json({
      message: "Se encontro el producto",
      product: product,
    });
  } else {
    res.status(500).json({ message: "No se encontro el producto" });
  }
});
// importar modelo de producto

/* POST Crear un nuevo producto del modelo Product*/
router.post("/", async (req, res) => {
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });
  await product
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
router.delete("/:id", async (req, res) => {
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
