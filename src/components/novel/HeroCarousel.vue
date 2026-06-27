<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-vue-next'
import type { Novel } from '@shared/types'

const props = defineProps<{
  novels: Novel[]
  loading: boolean
}>()

const router = useRouter()
const currentIndex = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval>

const currentNovel = computed(() => props.novels[currentIndex.value])

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % Math.max(props.novels.length, 1)
}

function prevSlide() {
  currentIndex.value = currentIndex.value === 0 ? props.novels.length - 1 : currentIndex.value - 1
}

function goToSlide(index: number) {
  currentIndex.value = index
}

function goDetail(id: string) {
  router.push(`/novel/${id}`)
}

onMounted(() => {
  autoPlayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(autoPlayInterval)
})
</script>

<template>
  <div class="relative h-[420px] md:h-[500px] overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-lavender-100/50 via-sakura-100/30 to-white" />

    <div class="absolute inset-0 flex items-center justify-center">
      <div class="absolute top-10 left-10 w-32 h-32 rounded-full bg-sakura-200/30 blur-3xl animate-pulse-slow" />
      <div class="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-lavender-200/40 blur-3xl animate-pulse-slow" style="animation-delay: 1s" />
      <div class="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-sky-200/30 blur-2xl animate-float" />
    </div>

    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="animate-pulse w-full">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-56 h-72 rounded-2xl bg-sakura-100/50"></div>
          <div class="flex-1 space-y-4">
            <div class="h-10 bg-sakura-100/50 rounded w-2/3"></div>
            <div class="h-5 bg-sakura-100/30 rounded w-1/3"></div>
            <div class="h-4 bg-sakura-100/30 rounded w-full"></div>
            <div class="h-4 bg-sakura-100/30 rounded w-5/6"></div>
            <div class="h-12 bg-sakura-100/50 rounded-full w-40 mt-6"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="currentNovel" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <transition name="slide" mode="out-in">
        <div :key="currentNovel.id" class="w-full flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8">
          <div class="flex-shrink-0 animate-fade-in">
            <div class="relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-sakura-300/40 to-lavender-300/40 rounded-3xl blur-xl animate-pulse-slow" />
              <img
                :src="currentNovel.cover"
                :alt="currentNovel.title"
                class="relative w-48 md:w-56 aspect-[3/4] rounded-2xl object-cover shadow-2xl shadow-sakura-300/30"
              />
            </div>
          </div>

          <div class="flex-1 text-center md:text-left animate-slide-up">
            <div class="flex items-center justify-center md:justify-start gap-2 mb-3">
              <span class="text-2xl">✨</span>
              <span class="text-sm font-medium text-sakura-500 uppercase tracking-wider">编辑推荐</span>
            </div>
            <h1 class="font-cute text-4xl md:text-5xl text-gray-800 text-shadow-glow mb-3">
              {{ currentNovel.title }}
            </h1>
            <p class="text-lg text-gray-600 mb-4">{{ currentNovel.author }}</p>
            <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <span v-for="tag in currentNovel.tags.slice(0, 4)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <p class="text-gray-600 leading-relaxed max-w-xl line-clamp-3 mb-6">
              {{ currentNovel.description }}
            </p>
            <button
              @click="goDetail(currentNovel.id)"
              class="btn-primary inline-flex items-center gap-2"
            >
              <BookOpen :size="18" />
              开始阅读
            </button>
          </div>
        </div>
      </transition>
    </div>

    <button
      v-if="!loading && novels.length > 1"
      @click="prevSlide"
      class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center hover:bg-white/90 transition-all hover:scale-110 shadow-lg"
    >
      <ChevronLeft :size="22" class="text-gray-700" />
    </button>
    <button
      v-if="!loading && novels.length > 1"
      @click="nextSlide"
      class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center hover:bg-white/90 transition-all hover:scale-110 shadow-lg"
    >
      <ChevronRight :size="22" class="text-gray-700" />
    </button>

    <div v-if="!loading && novels.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button
        v-for="(novel, index) in novels"
        :key="novel.id"
        @click="goToSlide(index)"
        :class="[
          'w-2 h-2 rounded-full transition-all duration-300',
          index === currentIndex ? 'w-8 bg-sakura-400' : 'bg-sakura-200 hover:bg-sakura-300'
        ]"
      />
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
