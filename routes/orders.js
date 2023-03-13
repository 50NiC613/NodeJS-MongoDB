const express = require("express");
const router = express.Router();
const Order = require("../models/order");
/* GET Listar las órdenes */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});
/**
 * POST Crear una orden async
 */
router.post("/", async function (req, res) {
  const order = new Order(req.body);
  await order
    .save()
    .then((orden) => {
      res.status(
        (200).json({
          message: "Orden creada",
          order: orden,
        })
      );
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        error: err,
      });
    });
});

module.exports = router;
