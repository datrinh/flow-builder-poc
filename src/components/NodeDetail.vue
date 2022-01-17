<script setup lang="ts">
import { Dialog, DialogTitle, DialogOverlay } from '@headlessui/vue'
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['close', 'delete', 'update'])

const currentTitle = ref(props.title) 

const isOpen = ref(true)
const close = () => {
  isOpen.value = false
  emit('close')
}
</script>

<template>
  <Dialog class="fixed inset-0 z-10 overflow-y-auto h-full" :open="isOpen" @close="close">
    <DialogOverlay class="fixed inset-0 bg-black opacity-30" />


    <div class="w-full max-w-sm p-6 m-auto transform translate-y-[40vh] bg-white shadow-xl rounded-xl">      
      <input type="text" class="p-2" v-model="currentTitle">

      <footer class="flex space-x-2 mt-2">
        <button class="p-2 rounded border" @click="close">Close</button>
        <button class="p-2 rounded border text-green-400" @click="emit('update', { title: currentTitle })">Save</button>
        <button class="p-2 rounded border text-red-400" @click="emit('delete')">Delete</button>
      </footer>

    </div>

  </Dialog>
</template>
