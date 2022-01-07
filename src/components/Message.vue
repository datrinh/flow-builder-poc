<template>
  <div class="p-2 rounded shadow bg-white">
    <span v-text="text"></span>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
    }
  },
  setup() {
    return {
    };
  },
});
</script>

<style scoped lang='postcss'>
</style>
