<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Petal {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  swayAmount: number
}

const petals = ref<Petal[]>([])
let petalId = 0
let interval: ReturnType<typeof setInterval>

function createPetal() {
  const petal: Petal = {
    id: petalId++,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 8 + Math.random() * 8,
    size: 8 + Math.random() * 10,
    swayAmount: 30 + Math.random() * 50
  }
  petals.value.push(petal)
  setTimeout(() => {
    petals.value = petals.value.filter(p => p.id !== petal.id)
  }, (petal.duration + petal.delay) * 1000)
}

onMounted(() => {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createPetal(), i * 200)
  }
  interval = setInterval(createPetal, 800)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="absolute"
      :style="{
        left: `${petal.left}%`,
        top: '-20px',
        animation: `sakuraFall ${petal.duration}s linear ${petal.delay}s infinite`,
        '--sway': `${petal.swayAmount}px`
      }"
    >
      <div
        class="sakura-petal"
        :style="{
          width: `${petal.size}px`,
          height: `${petal.size}px`
        }"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes sakuraFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translateY(25vh) translateX(calc(var(--sway) * 0.5)) rotate(180deg);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--sway) * -0.3)) rotate(360deg);
  }
  75% {
    transform: translateY(75vh) translateX(calc(var(--sway) * 0.4)) rotate(540deg);
  }
  100% {
    transform: translateY(110vh) translateX(0) rotate(720deg);
    opacity: 0;
  }
}
</style>
