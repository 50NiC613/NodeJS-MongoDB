const express = require("express");
const router = express.Router();
const { Order } = require("../models/orders");
const { OrderItem } = require("../models/order-item");
/* GET Listar las órdenes */
router.get("/", async (req, res) => {
  const orderList = await Order.find().populate("user");
  if (!orderList) {
    return res.status(404).json({ message: "No hay ordenes" });
  }
  return res.status(200).json(orderList);
});

/* GET Detalle de una orden */
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (!order) {
    return res.status(404).json({ message: "No hay orden" });
  }
  return res.status(200).json(order);
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
  const totalPrices = await Promise.all(
    orderItemsResolved.map(async (orderItemsId) => {
      const orderItem = await OrderItem.findById(orderItemsId).populate(
        "product",
        "name"
      );
      return orderItem.product.price * orderItem.quantity;
    })
  );
  console.log(totalPrices);
  const order = new Order({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) {
    return res.status(400).json({ message: "No se pudo crear la orden" });
  }
  return res.status(200).json(order);
});
/**
 * PUT Actualizar una orden async
 */
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
    }
  );
  if (order) {
    return res.status(200).json({ message: "Orden actualizada", order: order });
  } else {
    return res.status(500).json({ message: "No se encontro esa orden" });
  }
});

/**DELETE borrar orden*/
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id)
    .then((orden) => {
      orden.ordeItems.map(async (itemaborrar) => {
        await OrderItem.findByIdAndDelete(itemaborrar);
      });
      return res.status(200).json({
        message: "Orden eliminada",
        order: orden,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "No se encontro esa orden",
      });
    });
});
//GET ventas totales
router.get("/get/totalsales", async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);
  if (!orders) {
    return res.status(500).json({ message: "No se encontro ordenes" });
  } else {
    res
      .status(200)
      .json({ message: "ventas totales", orders: orders.pop().totalsales });
  }
});

//GET contar cantidad de ordenes
router.get("/get/count", async (req, res) => {
  const count = await Order.countDocuments();
  if (!count) {
    return res.status(500).json({ message: "No se encontro ordenes" });
  } else {
    return res
      .status(200)
      .json({ message: "cantidad de ordenes", count: count });
  }
});

//GET ordenes de un usuario
router.get("/get/orders/:userId", async (req, res) => {
  const userId = req.params.userId;
  const orders = await Order.find({ userId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
  if (!orders) {
    return res.status(500).json({ message: "No se encontro ordenes" });
  } else {
    return res
      .status(200)
      .json({ message: "ordenes de usuario", orders: orders });
  }
});

module.exports = router;
