const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

const router = express.Router();
const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();

        // Users collection
        const collection = db.collection('users');

        // Check existing email
        const existingEmail = await collection.findOne({
            email: req.body.email
        });

        if (existingEmail) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const email = req.body.email;

        // Insert user
        const newUser = await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email,
            password: hash,
            createdAt: new Date()
        });

        // JWT
        const payload = {
            user: {
                id: newUser.insertedId
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');

        res.json({
            authtoken,
            email
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;