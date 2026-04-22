<template>
  <div v-if="conflicts.length > 0" class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
    <div class="flex">
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          ⚠️ Conflicto de horarios detectado
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="conflict in conflicts" :key="conflict._id">
              El Dr. {{ conflict.doctorName }} ya tiene cita con {{ conflict.patientName }} 
              de {{ conflict.startTime }} a {{ conflict.endTime }}.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  conflicts: {
    type: Array,
    default: () => []
  }
});
</script>