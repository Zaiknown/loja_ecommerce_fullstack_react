const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');
const { protect } = require('../middleware/authMiddleware.js'); // Importa o nosso "guarda"

router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'Nenhum item no pedido' });
    }

    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item._id,
        _id: undefined
      })),
      user: req.user._id,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor ao criar o pedido.' });
  }
});

module.exports = router;
