const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const { Category } = require("../models/category");
const { OrderItem } = require("../models/order-item");
/* GET Listar las órdenes */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});
/**
 * POST Crear una orden async
 */
router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsResolved = await orderItemsIds;
  const order = new Order({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) {
    res.status(400).json({ message: "No se pudo crear la orden" });
  }
  res.status(200).json(order);
});
/**
 * PUT Actualizar una orden async
 */
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (order) {
    res.status(200).json({ message: "Orden actualizada", order: order });
  } else {
    res.status(500).json({ message: "No se encontro esa orden" });
  }
});

module.exports = router;
