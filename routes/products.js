const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
/* GET Listar los productos populate category y ?categories query
 */

router.get("/", async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  let products = await Product.find(filter).populate("category");
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

/* POST Crear un nuevo producto del modelo Product*/
router.post("/", async (req, res) => {
  // validar que es valido el id
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  //validar categoria
  let category = await Category.findById(req.body.category);
  if (!category) {
    res.status(500).json({ message: "No se encontro la categoria" });
  }

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
router.put("/:id", async (req, res) => {
  // validar que es valido el id
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  //Validar categoria
  let category = await Category.findById(req.body.category);
  if (!category) {
    res.status(500).json({ message: "No se encontro la categoria" });
  }
  let product = await Product.findByIdAndUpdate(
    id,
    {
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
    },
    { new: true }
  );
  //si no se actualizo
  if (!product) {
    res.status(500).json({ message: "No se encontro el producto" });
  }
  res.status(200).json({
    message: "Producto actualizado",
    product: product,
  });
});
/* DELETE Eliminar un producto */
router.delete("/:id", async (req, res) => {
  // validar que es valido el id
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  await Product.findByIdAndDelete(id).then((product) => {
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
// obtener cantidad de productos
router.get("get/count", async (req, res) => {
  const productCount = Product.countDocuments((count) => count);
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({
    message: "Productos totales",
  });
  // obtener productos destacados
  router.get("/featured/:count", async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
      res.status(500).json({ success: false });
    }
    res.status(200).json({
      message: "Productos destacados",
      products: products,
    });
  });
});
// obtener productos por categoria
router.get("/category/:category", async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({
    message: "Productos por categoria",
    products: products,
  });
});
// obtener productos por marca
router.get("/brand/:brand", async (req, res) => {
  const products = await Product.find({ brand: req.params.brand });
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({
    message: "Productos por marca",
    products: products,
  });
});
// obtener productos por precio
router.get("/price/:price", async (req, res) => {
  const products = await Product.find({ price: req.params.price });
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({
    message: "Productos por precio",
    products: products,
  });
});

module.exports = router;
