<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import SakuraEffect from './components/effects/SakuraEffect.vue'

const isReaderPage = ref(false)

function checkRoute() {
  isReaderPage.value = window.location.pathname.includes('/read/')
}

onMounted(() => {
  checkRoute()
  window.addEventListener('popstate', checkRoute)
})

onUnmounted(() => {
  window.removeEventListener('popstate', checkRoute)
})
</script>

<template>
  <div class="min-h-screen relative overflow-x-hidden">
    <SakuraEffect v-if="!isReaderPage" />
    <Navbar v-if="!isReaderPage" />
    <main :class="isReaderPage ? '' : 'pt-20'">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
