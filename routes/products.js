const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const multer = require("multer");

//configuracion de multer
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("tipo de imagen invalido");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage });

/* GET Listar los productos populate category
 */
// obtener cantidad de productos
router.get("get/count", async (req, res) => {
  const productCount = Product.countDocuments((count) => count);
  if (!productCount) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({
    message: "Productos totales",
  });
});

// obtener productos por categoría
router.get("/category/:category", async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  if (!products) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({
    message: "Productos por categoría",
    products: products,
  });
});
// obtener productos por marca
router.get("/brand/:brand", async (req, res) => {
  const products = await Product.find({ brand: req.params.brand });
  if (!products) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({
    message: "Productos por marca",
    products: products,
  });
});
// obtener productos por precio
router.get("/price/:price", async (req, res) => {
  const products = await Product.find({ price: req.params.price });
  if (!products) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({
    message: "Productos por precio",
    products: products,
  });
});

// obtener productos destacados
router.get("/featured", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(count);
  if (!products) {
    return res.status(500).json({
      success: false,
      message: " No se encontraron productos destacados",
    });
  }
  return res.status(200).json({
    message: "Productos destacados",
    products: products,
  });
});
router.get("/", async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  let products = await Product.find(filter).populate("category");
  if (!products) {
    return res.status(500).json({ success: false });
  }
  res.send(products);
});

/* GET producto por ID */
router.get("/:id", async (req, res) => {
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  let product = await Product.findById(id);
  if (product) {
    return res.status(200).json({
      message: "Se encontró el producto",
      product: product,
    });
  } else {
    return res
      .status(500)
      .json({ message: "No se encontró el producto por id" });
  }
});

/* POST Crear un nuevo producto del modelo Product*/
router.post("/", upload.single("image"), async (req, res) => {
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  //validar categoría
  let category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(500).json({ message: "No se encontró la categoría" });
  }
  //validar que se subio un archivo
  file = req.file;
  if (!file) return res.status(400).json({ message: " no se subio archivo" });
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: basePath,
    images: req.body.images,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });
  await product.save();
  if (!product) {
    return res.status(400).json({ message: "No se pudo crear el usuario" });
  } else {
    return res
      .status(200)
      .json({ message: "Se creo el usuario", product: product });
  }
});

/* PUT Actualizar un producto */
router.put("/:id", async (req, res) => {
  // validar que es válido el ID
  let id = null;
  if (isValidObjectId(req.params.id)) {
    id = req.params.id;
  }
  //Validar categoría
  let category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(500).json({ message: "No se encontró la categoría" });
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
    return res
      .status(500)
      .json({ message: "No se encontró el producto por id" });
  }
  return res.status(200).json({
    message: "Producto actualizado",
    product: product,
  });
});
/* DELETE Eliminar un producto */
router.delete("/:id", async (req, res) => {
  // validar que es válido el ID
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
        return res.status(500).json({
          message: err.message,
          error: err,
        });
      });
  });
});

module.exports = router;
