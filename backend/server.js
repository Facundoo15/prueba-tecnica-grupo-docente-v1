const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const appointmentRoutes = require('./src/routes/AppointmentRoutes');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_citas')
	.then(() => console.log('MongoDB conectado exitosamente'))
	.catch(err => console.error('Error conectando a MongoDB:', err));

app.use('/api/appointments', appointmentRoutes);


app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});