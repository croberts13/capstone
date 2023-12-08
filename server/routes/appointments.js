// make crud router for appointments that only belong to the logged in user and export it

'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        //return the appointments that match either the doctor_id or the patient_id
        const appointments = await db.Appointment.findAll({
            // where: Sequelize.or(
            //     { doctor_id: 20 ?? req.user.id },
            //     { patient_id: 0 ?? req.user.id },
            // ),
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const appointment = await db.Appointment.findByPk(req.params.id);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const appointment = await db.Appointment.create(req.body);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const appointment = await db.Appointment.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const appointment = await db.Appointment.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
