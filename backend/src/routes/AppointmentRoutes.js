const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController.js');

router.get('/conflicts/check', appointmentController.checkConflicts);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;