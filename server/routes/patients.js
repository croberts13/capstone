//make crud router endpoints for patients with model patient = db.User
const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
    try {
        const patients = await db.User.scope('patient').findAll();
        res.send(patients);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const patient = await db.User.scope('patient').findByPk(req.params.id);
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const patient = await db.User.scope('patient').create(req.body);
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const patient = await db.User.scope('patient').update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const patient = await db.User.scope('patient').destroy({
            where: {
                id: req.params.id
            }
        });
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
