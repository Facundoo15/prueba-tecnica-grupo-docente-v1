<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestión de Citas Médicas</h1>
      <button v-if="!showForm" @click="openCreateForm" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
        + Nueva Cita
      </button>
    </div>

    <div v-if="showForm" class="mb-8">
      <AppointmentForm 
        :initial-data="selectedAppointment"
        :loading="isSubmitting"
        :api-error="formError"
        @submit="handleSaveAppointment"
        @cancel="closeForm"
      />
    </div>

    <div v-else class="relative">
      <div v-if="isLoading" class="absolute top-2 right-2 flex z-10 pointer-events-none opacity-80">
        <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">Cargando...</span>
      </div>
      <AppointmentList 
        :appointments="appointments"
        :pagination="pagination"
        @edit="openEditForm"
        @delete="handleDelete"
        @filter="handleFilter"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { appointmentService } from '../service/api';
import AppointmentList from '../components/AppointmentList.vue';
import AppointmentForm from '../components/AppointmentForm.vue';

const appointments = ref([]);
const pagination = ref({ page: 1, totalPages: 1 });
const currentFilters = ref({});
const showForm = ref(false);
const selectedAppointment = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);
const formError = ref(null);

const fetchAppointments = async (filters = {}) => {
  isLoading.value = true;
  try {
    const response = await appointmentService.getAll(filters);
    // Verificar si la respuesta es paginada { data, totalPages, ... }
    if (response && response.data) {
      appointments.value = response.data;
      pagination.value = {
        page: response.page || 1,
        totalPages: response.totalPages || 1
      };
    } else {
      appointments.value = response || [];
    }
  } catch (error) {
    console.error("Error cargando citas:", error);
    alert("Error al conectar con el servidor.");
  } finally {
    isLoading.value = false;
  }
};

const handleFilter = (filters) => {
  currentFilters.value = { ...filters, page: 1 };
  fetchAppointments(currentFilters.value);
};

const handlePageChange = (newPage) => {
  currentFilters.value.page = newPage;
  fetchAppointments(currentFilters.value);
};

const openCreateForm = () => {
  selectedAppointment.value = null;
  formError.value = null;
  showForm.value = true;
};

const openEditForm = (appointment) => {
  selectedAppointment.value = appointment;
  formError.value = null;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  selectedAppointment.value = null;
  formError.value = null;
};

const handleSaveAppointment = async (formData) => {
  isSubmitting.value = true;
  formError.value = null;
  try {
    if (selectedAppointment.value) {
      await appointmentService.update(selectedAppointment.value._id, formData);
    } else {
      await appointmentService.create(formData);
    }
    await fetchAppointments(currentFilters.value); // Recargar lista
    closeForm();
  } catch (error) {
    // Si el backend lanza un 409 (conflicto) o 400, el catch lo atrapa
    formError.value = error; 
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta cita?')) return;
  
  try {
    await appointmentService.delete(id);
    await fetchAppointments(currentFilters.value);
  } catch (error) {
    alert("No se pudo eliminar la cita.");
  }
};

onMounted(() => {
  fetchAppointments();
});
</script>