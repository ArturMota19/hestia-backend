const express = require('express');
const authRoutes = require('./routes/authRoutes');
const peopleRoutes = require('./routes/peopleRoutes')
const activitiesRoutes = require('./routes/activitiesRoutes')
const roomsRoutes = require('./routes/roomsRoutes')
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true, 
}));

app.use('/auth', authRoutes);
app.use('/people', peopleRoutes)
app.use('/activities', activitiesRoutes)
app.use('/rooms', roomsRoutes)

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Banco de dados sincronizado.');

    // Verifica se já existe um usuário administrador
    const existingUser = await User.findOne({ where: { isAdmin: true } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        isSearcherUFBA: true
      });
      console.log('Usuário padrão criado.');
    } else {
      console.log('Usuário administrador já existe.');
    }
  })
  .catch(err => console.error('Erro ao sincronizar banco:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));