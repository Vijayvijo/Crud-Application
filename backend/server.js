const express = require('express');
const cors = require('cors');
const app = require('./app'); 
const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ['http://localhost:3000', 'https://crud-application-tau.vercel.app'],
  credentials: true
}));


sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' DB connection failed:', err);
  });
