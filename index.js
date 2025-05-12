const express = require('express');
const authRoutes = require('./routes/authRoutes');
const peopleRoutes = require('./routes/peopleRoutes')
const activitiesRoutes = require('./routes/activitiesRoutes')
const cors = require('cors');
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));