<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search as SearchIcon, X } from 'lucide-vue-next'
import { api } from '../utils/api'
import type { Novel } from '@shared/types'
import NovelCard from '../components/novel/NovelCard.vue'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) || '')
const results = ref<Novel[]>([])
const loading = ref(false)
const searched = ref(false)

async function doSearch() {
  if (!query.value.trim()) {
    results.value = []
    searched.value = false
    return
  }
  loading.value = true
  searched.value = true
  try {
    results.value = await api.searchNovels(query.value.trim())
  } catch (e) {
    console.error('Search failed:', e)
  } finally {
    loading.value = false
  }
}

function submitSearch() {
  router.push({ path: '/search', query: { q: query.value.trim() } })
  doSearch()
}

function clearSearch() {
  query.value = ''
  results.value = []
  searched.value = false
  router.push({ path: '/search' })
}

watch(() => route.query.q, (newQ) => {
  if (newQ && typeof newQ === 'string') {
    query.value = newQ
    doSearch()
  }
})

onMounted(() => {
  if (query.value) {
    doSearch()
  }
})
</script>

<template>
  <div class="relative z-10 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto mb-12">
        <h1 class="font-cute text-3xl text-center mb-6 text-gray-800">🔍 搜索小说</h1>
        <div class="relative">
          <input
            v-model="query"
            @keyup.enter="submitSearch"
            type="text"
            placeholder="输入小说名、作者名或标签..."
            class="w-full pl-12 pr-20 py-4 rounded-2xl glass border-0 text-lg shadow-xl shadow-sakura-100/30 focus:outline-none focus:ring-2 focus:ring-sakura-300"
            autofocus
          />
          <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="22" />
          <button
            v-if="query"
            @click="clearSearch"
            class="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X :size="18" />
          </button>
          <button
            @click="submitSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-sakura-400 to-sakura-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            搜索
          </button>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-[3/4] rounded-2xl bg-sakura-100/50"></div>
          <div class="mt-3 h-4 bg-sakura-100/50 rounded w-3/4"></div>
        </div>
      </div>

      <div v-else-if="searched && results.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">😢</div>
        <p class="text-gray-500 text-lg">没有找到相关小说呢~</p>
        <p class="text-gray-400 text-sm mt-2">换个关键词试试吧</p>
      </div>

      <div v-else-if="results.length > 0">
        <p class="text-gray-500 mb-6">找到 <span class="text-sakura-500 font-medium">{{ results.length }}</span> 本相关小说</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <NovelCard v-for="novel in results" :key="novel.id" :novel="novel" />
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-gray-500 text-lg">输入关键词开始搜索吧~</p>
      </div>
    </div>
  </div>
</template>
