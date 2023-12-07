const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('', (req, res) => {
    res.send('respond with a resource');
});

// routes for registering new users, login, logout, etc.
router.post('/register', async (req, res, next) => {
    const { username, password, role_id /* other user information */ } =
        req.body;

    try {
        // Check if the username already exists in the database
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user in the database
        const newUser = await User.create({
            username,
            password,
            role_id,
            // Add other user information here
        });

        // Create JWT token
        const token = jwt.sign(
            { username: newUser.username },
            'your_secret_key',
            {
                expiresIn: '1h',
            }
        );

        // Set the token as a session cookie
        res.cookie('sessionToken', token, { httpOnly: true, maxAge: 3600000 }); // Max age in milliseconds (1 hour)

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ username: user.username }, 'your_secret_key', {
            expiresIn: '1h',
        });

        // Set the token as a session cookie
        res.cookie('sessionToken', token, { httpOnly: true, maxAge: 3600000 }); // Max age in milliseconds (1 hour)

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/logout', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/me', (req, res, next) => {
    res.send('respond with a resource');
    console.log(req.user);
    res.send(req.user);
});

module.exports = router;
