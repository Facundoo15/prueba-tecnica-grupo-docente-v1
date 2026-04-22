<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 bg-white p-6 rounded shadow-md">
    <h2 class="text-xl font-bold">{{ isEditing ? 'Editar' : 'Nueva' }} Cita</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Paciente</label>
        <input v-model="form.patientName" type="text" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Doctor</label>
        <input v-model="form.doctorName" type="text" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Fecha</label>
        <input v-model="form.date" type="date" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
      </div>
      <div class="flex space-x-2">
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700">Inicio</label>
          <input v-model="form.startTime" type="time" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
        </div>
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700">Fin</label>
          <input v-model="form.endTime" type="time" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Motivo</label>
      <textarea v-model="form.reason" required class="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"></textarea>
    </div>

    <ConflictAlert :conflicts="localConflicts" />
    
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

    <div class="flex justify-end space-x-2 mt-4">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancelar</button>
      <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {{ loading ? 'Guardando...' : 'Guardar Cita' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import ConflictAlert from './ConflictAlert.vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  apiError: { type: Object, default: null },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  patientName: '',
  doctorName: '',
  date: '',
  startTime: '',
  endTime: '',
  reason: '',
  status: 'scheduled'
});

const localConflicts = ref([]);
const errorMessage = ref('');

watch(() => props.initialData, (newData) => {
  if (newData) {
    const formattedDate = new Date(newData.date).toISOString().split('T')[0];
    form.value = { ...newData, date: formattedDate };
  } else {
    // Resetear form
    form.value = { patientName: '', doctorName: '', date: '', startTime: '', endTime: '', reason: '', status: 'scheduled' };
  }
}, { immediate: true });

watch(() => props.apiError, (err) => {
  if (err) {
    errorMessage.value = err.error || 'Error al guardar';
    localConflicts.value = err.conflicts || [];
  } else {
    errorMessage.value = '';
    localConflicts.value = [];
  }
});

const handleSubmit = () => {
  errorMessage.value = '';
  localConflicts.value = [];
  emit('submit', form.value);
};
</script>