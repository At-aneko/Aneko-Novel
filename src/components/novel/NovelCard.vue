<script setup lang="ts">
import type { Novel } from '@shared/types'
import { useRouter } from 'vue-router'

defineProps<{
  novel: Novel
}>()

const router = useRouter()

function goDetail(id: string) {
  router.push(`/novel/${id}`)
}
</script>

<template>
  <div
    @click="goDetail(novel.id)"
    class="group cursor-pointer"
  >
    <div class="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg shadow-sakura-100/40 card-hover">
      <img
        :src="novel.cover"
        :alt="novel.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div class="absolute top-2 left-2">
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full backdrop-blur-sm font-medium',
            novel.status === 'completed'
              ? 'bg-green-500/80 text-white'
              : 'bg-sakura-500/80 text-white'
          ]"
        >
          {{ novel.status === 'completed' ? '完结' : '连载' }}
        </span>
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <button class="w-full py-2 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-medium text-sakura-600 hover:bg-white transition-colors">
          开始阅读
        </button>
      </div>
    </div>
    <div class="mt-3 px-1">
      <h3 class="font-medium text-gray-800 dark:text-gray-100 group-hover:text-sakura-500 transition-colors truncate">
        {{ novel.title }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ novel.author }}</p>
      <div class="flex flex-wrap gap-1 mt-1.5">
        <span v-for="tag in novel.tags.slice(0, 2)" :key="tag" class="tag text-[10px]">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
