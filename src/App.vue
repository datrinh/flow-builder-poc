<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { parse } from 'query-string';
import { Provider } from '@hello-charles/satellite-shared';
import Messages from './components/Messages.vue'

const data = window.location.search;
const parsedData = parse(data) as Record<string, string>;
const { universe_uri = 'http://localhost:3000', script_id = '' } = parsedData
window.onload = () => {
  window.document.body.style.overflow = 'hidden';
  window.parent.postMessage(window.document.body.scrollHeight, {
    targetOrigin: parsedData.origin,
  });
};

const apiUrl = `storefronts/scripts/${script_id}/public/api/v0/webhooks/webchat`
const message = ref('')

const provider = new Provider({
  universe_uri,
  script_id
})

const onSubmit = () => {
  provider.makeRequest({
    url: apiUrl,
    method: 'POST',
    body: {
      message: message.value
    }
  })
}
</script>

<template>
  <div class="flex flex-col p-4 w-64 h-96">
    <Messages />
    <footer class="w-full mt-2 flex">
      <form class="flex w-full space-x-2" @submit.prevent="onSubmit">
        <input
          type="text"
          v-model="message"
          class="px-2 bg-gray-100 rounded-sm min-w-0"
          placeholder="Type message"
        />
        <button type="submit" class="p-2 bg-green-300 rounded-sm">Send</button>
      </form>
    </footer>
  </div>
</template>
