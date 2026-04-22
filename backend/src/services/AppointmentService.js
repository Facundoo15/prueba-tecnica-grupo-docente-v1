const Appointment = require('../models/Appointment');

class AppointmentService {

    async checkConflicts(doctorName, date, startTime, endTime, excludeId = null) {
        const query = {
            doctorName,
            date: new Date(date),
            status: { $ne: 'cancelled' },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return await Appointment.find(query);
    }

    async createAppointment(data) {
        const { doctorName, date, startTime, endTime } = data;

        // Validar fecha
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            throw { status: 400, message: 'La fecha no puede ser anterior a hoy' };
        }

        // Validar horas
        if (startTime >= endTime) {
            throw { status: 400, message: 'La hora de fin debe ser posterior a la de inicio' };
        }

        // Validar conflictos
        const conflicts = await this.checkConflicts(doctorName, date, startTime, endTime);
        if (conflicts.length > 0) {
            throw { status: 409, message: 'Existe conflicto de horarios', conflicts };
        }

        // Guardar
        const appointment = new Appointment(data);
        return await appointment.save();
    }

    async getAllAppointments(filters) {
        const { startDate, endDate, doctorName, status, page = 1, limit = 5 } = filters;
        let query = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate + 'T00:00:00');
            if (endDate) {
                query.date.$lte = new Date(endDate + 'T23:59:59.999');
            }
        }

        if (doctorName) query.doctorName = new RegExp(doctorName, 'i');
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [data, total] = await Promise.all([
            Appointment.find(query).sort({ date: 1, startTime: 1 }).skip(skip).limit(parseInt(limit)),
            Appointment.countDocuments(query)
        ]);

        return {
            data,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        };
    }

    async getAppointmentById(id) {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            throw { status: 404, message: 'Cita no encontrada' };
        }
        return appointment;
    }

    async updateAppointment(id, data) {
        const { doctorName, date, startTime, endTime, reason, status } = data;

        // Validar fecha
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            throw { status: 400, message: 'La fecha no puede ser anterior a hoy' };
        }

        // Validar horas
        if (startTime >= endTime) {
            throw { status: 400, message: 'La hora de fin debe ser posterior a la de inicio' };
        }

        //  Validar conflictos 
        const conflicts = await this.checkConflicts(doctorName, date, startTime, endTime, id);
        if (conflicts.length > 0) {
            throw { status: 409, message: 'Existe conflicto de horarios', conflicts };
        }

        // Actualizar
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { doctorName, date, startTime, endTime, reason, status },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            throw { status: 404, message: 'Cita no encontrada' };
        }
    }

    async deleteAppointment(id) {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            throw { status: 404, message: 'Cita no encontrada' };
        }
        return deletedAppointment;
    }
}

module.exports = new AppointmentService();