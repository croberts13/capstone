// make crud router endpoints for doctors with model doctor = db.User
'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
    try {
        const doctors = await db.User.scope('doctor').findAll();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doctor = await db.User.findByPk(req.params.id);
        res.send(doctor);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const doctor = await db.User.create(req.body);
        res.send(doctor);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const doctor = await db.User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.send(doctor);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const doctor = await db.User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.send(doctor);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
