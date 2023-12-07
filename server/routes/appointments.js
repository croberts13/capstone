// make crud router for appointments that only belong to the logged in user and export it

'use strict';
const express = require('express');
const router = express.Router();
const { Appointment, User, UserRole } = require('../models');

router.get('/', async (req, res) => {
    try {
        //return the appointments that match either the doctor_id or the patient_id
        const appointments = await Appointment.findAll({
            $where: {
                $or: [{ doctorId: req.user.id }, { patientId: req.user.id }],
            },
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.update(req.body, {
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
        const appointment = await Appointment.destroy({
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
