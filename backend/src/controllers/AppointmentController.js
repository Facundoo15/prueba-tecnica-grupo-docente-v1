const appointmentService = require('../services/AppointmentService');

exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: error.message,
                conflicts: error.conflicts
            });
        }
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments(req.query);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        res.json(appointment);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al obtener la cita' });
    }
};

exports.checkConflicts = async (req, res) => {
    try {
        const { doctorName, date, startTime, endTime, excludeId } = req.query;

        if (!doctorName || !date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        const conflicts = await appointmentService.checkConflicts(doctorName, date, startTime, endTime, excludeId);
        res.json(conflicts);
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar conflictos' });
    }


};

exports.updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await appointmentService.updateAppointment(req.params.id, req.body);
        res.json(updatedAppointment);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message, conflicts: error.conflicts });
        }
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};