<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../utils/api'
import type { Novel } from '@shared/types'
import NovelCard from '../novel/NovelCard.vue'
import CategoryBar from '../novel/CategoryBar.vue'
import HeroCarousel from '../novel/HeroCarousel.vue'
import { Sparkles, Clock } from 'lucide-vue-next'

const featuredNovels = ref<Novel[]>([])
const latestNovels = ref<Novel[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [featured, latest] = await Promise.all([
      api.getFeaturedNovels(),
      api.getLatestNovels()
    ])
    featuredNovels.value = featured
    latestNovels.value = latest
  } catch (e) {
    console.error('Failed to load novels:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="relative z-10">
    <HeroCarousel :novels="featuredNovels" :loading="loading" />

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
      <CategoryBar />
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-200/50">
          <Sparkles class="text-white" :size="20" />
        </div>
        <div>
          <h2 class="text-2xl font-cute text-gray-800">热门推荐</h2>
          <p class="text-sm text-gray-500">编辑精选优质作品</p>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-[3/4] rounded-2xl bg-sakura-100/50"></div>
          <div class="mt-3 h-4 bg-sakura-100/50 rounded w-3/4"></div>
          <div class="mt-2 h-3 bg-sakura-50/50 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <NovelCard v-for="novel in featuredNovels" :key="novel.id" :novel="novel" />
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-200/50">
          <Clock class="text-white" :size="20" />
        </div>
        <div>
          <h2 class="text-2xl font-cute text-gray-800">最新更新</h2>
          <p class="text-sm text-gray-500">追更快人一步</p>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse flex gap-4 p-4 rounded-2xl glass">
          <div class="w-20 h-28 rounded-xl bg-sakura-100/50 flex-shrink-0"></div>
          <div class="flex-1">
            <div class="h-5 bg-sakura-100/50 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-sakura-50/50 rounded w-1/3 mb-3"></div>
            <div class="h-3 bg-sakura-50/50 rounded w-full"></div>
            <div class="h-3 bg-sakura-50/50 rounded w-2/3 mt-1"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          v-for="novel in latestNovels"
          :key="novel.id"
          :to="`/novel/${novel.id}`"
          class="flex gap-4 p-4 rounded-2xl glass card-hover group cursor-pointer"
        >
          <div class="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <img
              :src="novel.cover"
              :alt="novel.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-800 group-hover:text-sakura-500 transition-colors truncate">
              {{ novel.title }}
            </h3>
            <p class="text-sm text-gray-500 mt-0.5">{{ novel.author }}</p>
            <p class="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
              {{ novel.description }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  novel.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-sakura-100 text-sakura-600'
                ]"
              >
                {{ novel.status === 'completed' ? '已完结' : '连载中' }}
              </span>
              <span class="text-xs text-gray-400">{{ Math.round(novel.wordCount / 10000) }}万字</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>
