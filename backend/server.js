require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
  }],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  totalPrice: { type: Number, required: true, default: 0.0 },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uma_chave_secreta_padrao');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado como administrador' });
  }
};

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Utilizador já existe.' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: 'Utilizador registado com sucesso!' });
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user._id, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'uma_chave_secreta_padrao',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Credenciais inválidas.' });
  }
});

app.post('/api/orders', protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'Nenhum item no pedido' });
  }
  const order = new Order({
    orderItems: orderItems.map(item => ({ ...item, product: item._id, _id: undefined })),
    user: req.user._id,
    shippingAddress,
    totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

app.get('/api/orders/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor ao buscar os pedidos.' });
  }
});

app.get('/api/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar os pedidos.' });
  }
});

app.get('/api/products', async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  try {
    const count = await Product.countDocuments();
    const products = await Product.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
});

app.get('/api/products/all', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar todos os produtos.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produto não encontrado.' });
  }
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    imageUrl: req.body.imageUrl
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto.' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado para atualizar.' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado para apagar.' });
    }
    res.json({ message: 'Produto apagado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar produto.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a rodar na porta ${PORT}`);
});