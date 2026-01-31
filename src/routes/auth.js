const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const router = express.Router();

router.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    const user = { name: username, id: username };
    const accessToken = jwt.sign(user, config.JWT_SECRET);
    
    res.json({ accessToken });
});

module.exports = router;
