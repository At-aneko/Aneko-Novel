<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../utils/api'
import type { Novel, PaginatedResponse } from '@shared/types'
import NovelCard from '../components/novel/NovelCard.vue'
import CategoryBar from '../components/novel/CategoryBar.vue'

const route = useRoute()
const categoryId = ref(route.params.category as string)

const novels = ref<Novel[]>([])
const loading = ref(true)
const page = ref(1)
const hasMore = ref(false)
const total = ref(0)

const categoryNames: Record<string, string> = {
  all: '全部小说',
  fantasy: '奇幻',
  romance: '恋爱',
  campus: '校园',
  scifi: '科幻',
  mystery: '悬疑',
  adventure: '冒险',
  daily: '日常'
}

async function loadNovels(reset = false) {
  if (reset) {
    page.value = 1
    novels.value = []
  }
  loading.value = true
  try {
    const cat = categoryId.value === 'all' ? undefined : categoryId.value
    const data: PaginatedResponse<Novel> = await api.getNovels(page.value, 12, cat)
    novels.value = [...novels.value, ...data.items]
    hasMore.value = data.hasMore
    total.value = data.total
  } catch (e) {
    console.error('Failed to load novels:', e)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (hasMore.value && !loading.value) {
    page.value++
    loadNovels()
  }
}

watch(() => route.params.category, (newCat) => {
  if (newCat && typeof newCat === 'string') {
    categoryId.value = newCat
    loadNovels(true)
  }
})

onMounted(() => loadNovels(true))
</script>

<template>
  <div class="relative z-10 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <CategoryBar />
      </div>

      <div class="flex items-center justify-between mb-8">
        <h1 class="font-cute text-2xl text-gray-800 flex items-center gap-2">
          <span>📚</span>
          {{ categoryNames[categoryId] || categoryId }}
          <span class="text-sm font-normal text-gray-500">共 {{ total }} 本</span>
        </h1>
      </div>

      <div v-if="loading && novels.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div v-for="i in 12" :key="i" class="animate-pulse">
          <div class="aspect-[3/4] rounded-2xl bg-sakura-100/50"></div>
          <div class="mt-3 h-4 bg-sakura-100/50 rounded w-3/4"></div>
          <div class="mt-2 h-3 bg-sakura-50/50 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="novels.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-gray-500 text-lg">该分类暂无小说</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
        </div>

        <div v-if="hasMore" class="text-center mt-12">
          <button
            @click="loadMore"
            :disabled="loading"
            class="btn-secondary"
          >
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
