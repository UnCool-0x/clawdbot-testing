const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/status', (req, res) => res.json({ status: "OK", version: "2.0.0" }));

module.exports = app;
