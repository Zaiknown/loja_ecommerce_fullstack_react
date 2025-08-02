// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');
const { protect } = require('../middleware/authMiddleware.js'); // Importa o nosso "guarda"

// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Privado (precisa de token)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'Nenhum item no pedido' });
    }

    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item._id, // Garante que a referência do produto está correta
        _id: undefined // Remove o _id do item do carrinho para que o MongoDB gere um novo
      })),
      user: req.user._id, // O ID do utilizador vem do middleware 'protect'
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
