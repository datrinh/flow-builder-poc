<script setup lang='ts'>
import Message from './Message.vue'
</script>

<template>
  <section class="flex flex-col border flex-grow w-full p-4 wrapper">
    <Message text="Hello there!" />
  </section>
</template>


<style>
.wrapper {
  background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
}
</style>
