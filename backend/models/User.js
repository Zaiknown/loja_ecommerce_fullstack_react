// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Garante que não haverá dois utilizadores com o mesmo email
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false // Por padrão, um novo utilizador não é administrador
  }
}, {
  timestamps: true // Adiciona os campos createdAt e updatedAt automaticamente
});

const User = mongoose.model('User', userSchema);

// Esta linha é a mais importante! Ela torna o modelo 'User' disponível para outros ficheiros.
module.exports = User;
