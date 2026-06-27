<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../../utils/api'
import type { Category } from '@shared/types'
import { useRouter, useRoute } from 'vue-router'

const categories = ref<Category[]>([])
const loading = ref(true)
const activeCategory = ref('all')
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    categories.value = await api.getCategories()
    if (route.params.category) {
      activeCategory.value = route.params.category as string
    }
  } catch (e) {
    console.error('Failed to load categories:', e)
  } finally {
    loading.value = false
  }
})

function selectCategory(catId: string) {
  activeCategory.value = catId
  if (catId === 'all') {
    router.push('/')
  } else {
    router.push(`/category/${catId}`)
  }
}
</script>

<template>
  <div class="glass rounded-2xl p-4 shadow-xl shadow-sakura-100/20">
    <div v-if="loading" class="flex gap-2 overflow-x-auto pb-1">
      <div v-for="i in 8" :key="i" class="animate-pulse flex-shrink-0">
        <div class="h-9 w-20 rounded-full bg-sakura-100/50"></div>
      </div>
    </div>
    <div v-else class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        :class="[
          'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          activeCategory === cat.id
            ? 'bg-gradient-to-r from-sakura-400 to-sakura-500 text-white shadow-lg shadow-sakura-200/50 scale-105'
            : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-sakura-50 dark:hover:bg-gray-700 hover:text-sakura-500'
        ]"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.name }}</span>
        <span
          v-if="cat.count > 0"
          :class="[
            'text-xs px-1.5 py-0.5 rounded-full',
            activeCategory === cat.id ? 'bg-white/20' : 'bg-sakura-100 text-sakura-500'
          ]"
        >
          {{ cat.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
