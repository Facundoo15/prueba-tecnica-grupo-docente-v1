<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
    <div class="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-end">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Desde</label>
        <input type="date" v-model="filters.startDate" @change="emitFilters" class="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Hasta</label>
        <input type="date" v-model="filters.endDate" @change="emitFilters" class="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Doctor</label>
        <input type="text" v-model="filters.doctorName" placeholder="Nombre del profesional..." @input="emitFilters" class="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Estado</label>
        <select v-model="filters.status" @change="emitFilters" class="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Todos</option>
          <option value="scheduled">Programada</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Fecha/Hora</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Paciente</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Doctor</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="apt in appointments" :key="apt._id" class="hover:bg-blue-50/30 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="font-bold text-gray-900">{{ formatDate(apt.date) }}</span><br>
              <span class="text-gray-500 text-xs font-mono">{{ apt.startTime }} - {{ apt.endTime }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ apt.patientName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{{ apt.doctorName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="statusBadgeClass(apt.status)" class="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {{ apt.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button @click="$emit('edit', apt)" class="text-blue-600 hover:text-blue-900 font-bold mr-4">Editar</button>
              <button @click="$emit('delete', apt._id)" class="text-red-500 hover:text-red-700 font-bold">Eliminar</button>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
             <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">No se encontraron citas con los filtros aplicados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
      <p class="text-xs text-gray-500 font-medium">
        Página <span class="text-blue-600">{{ pagination.page }}</span> de {{ pagination.totalPages }}
      </p>
      <div class="flex gap-2">
        <button 
          @click="changePage(-1)" 
          :disabled="pagination.page <= 1"
          class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Anterior
        </button>
        <button 
          @click="changePage(1)" 
          :disabled="pagination.page >= pagination.totalPages"
          class="px-4 py-2 text-xs font-bold border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  appointments: { type: Array, required: true },
  pagination: { 
    type: Object, 
    default: () => ({ page: 1, totalPages: 1 }) 
  }
});

const emit = defineEmits(['edit', 'delete', 'filter', 'page-change']);

const filters = ref({
  startDate: '',
  endDate: '',
  doctorName: '',
  status: ''
});

// Solución al bug de fecha (Normalización)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString.split('T')[0] + 'T00:00:00');
  return date.toLocaleDateString();
};

const changePage = (offset) => {
  emit('page-change', props.pagination.page + offset);
};

const emitFilters = () => {
  // Limpiamos los filtros para no enviar strings vacíos al backend
  const cleanFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== '')
  );
  emit('filter', cleanFilters);
};

const statusBadgeClass = (status) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-700 border border-blue-200',
    completed: 'bg-green-100 text-green-700 border border-green-200',
    cancelled: 'bg-red-100 text-red-700 border border-red-200'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};
</script>