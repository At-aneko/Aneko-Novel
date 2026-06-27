<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../utils/api'
import {
  ChevronLeft, ChevronRight, List, Settings, Type, Sun, Moon,
  Leaf, Heart, Minus, Plus, Home, X, ArrowLeft
} from 'lucide-vue-next'
import type { ChapterContent, Volume } from '@shared/types'

const route = useRoute()
const router = useRouter()
const novelId = route.params.id as string
const chapterId = route.params.chapterId as string

interface ChapterNav {
  id: string
  title: string
}

const chapter = ref<(ChapterContent & {
  prevChapter: ChapterNav | null
  nextChapter: ChapterNav | null
  novel: { id: string; title: string; author: string }
}) | null>(null)
const volumes = ref<Volume[]>([])
const loading = ref(true)
const showControls = ref(true)
const showSettings = ref(false)
const showToc = ref(false)
const saveTimeout = ref<ReturnType<typeof setTimeout>>()

const fontSize = ref(18)
const lineHeight = ref(2)
const theme = ref<'day' | 'night' | 'eye' | 'pink'>('day')
const fontFamily = ref<'serif' | 'sans'>('serif')

const contentParagraphs = computed(() => {
  if (!chapter.value?.content) return []
  return chapter.value.content.split('\n').filter(p => p.trim())
})

const themeClass = computed(() => {
  switch (theme.value) {
    case 'night': return 'theme-night'
    case 'eye': return 'theme-eye'
    case 'pink': return 'theme-pink'
    default: return 'theme-day'
  }
})

const themeTextClass = computed(() => {
  return theme.value === 'night' ? 'text-gray-300' : 'text-gray-800'
})

let hideTimeout: ReturnType<typeof setTimeout>

function resetHideTimer() {
  showControls.value = true
  clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    if (!showSettings.value && !showToc.value) {
      showControls.value = false
    }
  }, 3000)
}

function showControlsTemporarily() {
  showControls.value = true
  clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    if (!showSettings.value && !showToc.value) {
      showControls.value = false
    }
  }, 3000)
}

async function loadChapter() {
  loading.value = true
  try {
    const [chapterData, volumesData] = await Promise.all([
      api.getChapterContent(novelId, chapterId),
      api.getChapters(novelId)
    ])
    chapter.value = chapterData
    volumes.value = volumesData
    window.scrollTo(0, 0)
    nextTick(() => {
      resetHideTimer()
    })
  } catch (e) {
    console.error('Failed to load chapter:', e)
  } finally {
    loading.value = false
  }
}

function goToChapter(chId: string) {
  router.push(`/novel/${novelId}/read/${chId}`)
  showToc.value = false
}

function goPrev() {
  if (chapter.value?.prevChapter) {
    goToChapter(chapter.value.prevChapter.id)
  }
}

function goNext() {
  if (chapter.value?.nextChapter) {
    goToChapter(chapter.value.nextChapter.id)
  }
}

function goBack() {
  router.push(`/novel/${novelId}`)
}

function saveProgress() {
  if (saveTimeout.value) clearTimeout(saveTimeout.value)
  saveTimeout.value = setTimeout(() => {
    const scrollPosition = window.scrollY
    api.saveProgress(novelId, chapterId, scrollPosition).catch(() => {})
  }, 1000)
}

async function restorePosition() {
  try {
    const progress = await api.getProgress(novelId)
    if (progress && progress.chapterId === chapterId && progress.scrollPosition > 0) {
      nextTick(() => {
        setTimeout(() => {
          window.scrollTo({ top: progress.scrollPosition, behavior: 'auto' })
        }, 100)
      })
    }
  } catch {}
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') goPrev()
  if (e.key === 'ArrowRight') goNext()
  if (e.key === 'Escape') {
    showSettings.value = false
    showToc.value = false
    showControlsTemporarily()
  }
}

function handleTouch(e: TouchEvent) {
  const touch = e.touches[0]
  const screenWidth = window.innerWidth
  if (touch.clientX < screenWidth / 3) {
    goPrev()
  } else if (touch.clientX > screenWidth * 2 / 3) {
    goNext()
  } else {
    showControlsTemporarily()
  }
}

function adjustFontSize(delta: number) {
  fontSize.value = Math.max(14, Math.min(28, fontSize.value + delta))
}

function setTheme(t: 'day' | 'night' | 'eye' | 'pink') {
  theme.value = t
}

watch(() => route.params.chapterId, loadChapter)

onMounted(() => {
  loadChapter().then(() => {
    restorePosition()
  })
  window.addEventListener('scroll', saveProgress)
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchstart', handleTouch)
  resetHideTimer()
})

onUnmounted(() => {
  window.removeEventListener('scroll', saveProgress)
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('touchstart', handleTouch)
  clearTimeout(hideTimeout)
  if (saveTimeout.value) clearTimeout(saveTimeout.value)
})
</script>

<template>
  <div
    :class="['min-h-screen transition-colors duration-300', themeClass]"
    @mousemove="showControlsTemporarily"
    @click="showControlsTemporarily"
  >
    <transition name="fade">
      <header
        v-if="showControls"
        :class="[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          theme === 'night' ? 'glass-dark' : 'glass'
        ]"
      >
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button @click="goBack" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <ArrowLeft :size="22" :class="theme === 'night' ? 'text-gray-300' : 'text-gray-700'" />
          </button>
          <div class="text-center min-w-0 flex-1 px-4">
            <h2 class="font-medium truncate" :class="themeTextClass">
              {{ chapter?.novel.title || '加载中...' }}
            </h2>
            <p class="text-sm text-gray-500 truncate">{{ chapter?.title }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button @click.stop="showToc = !showToc; showSettings = false" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <List :size="20" :class="theme === 'night' ? 'text-gray-300' : 'text-gray-700'" />
            </button>
            <button @click.stop="showSettings = !showSettings; showToc = false" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <Settings :size="20" :class="theme === 'night' ? 'text-gray-300' : 'text-gray-700'" />
            </button>
          </div>
        </div>
      </header>
    </transition>

    <main class="max-w-3xl mx-auto px-6 py-24 md:py-28">
      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="h-8 bg-current opacity-10 rounded w-1/2 mx-auto"></div>
        <div v-for="i in 10" :key="i" class="space-y-3">
          <div class="h-4 bg-current opacity-10 rounded w-full"></div>
          <div class="h-4 bg-current opacity-10 rounded w-[95%]"></div>
          <div class="h-4 bg-current opacity-10 rounded w-[90%]"></div>
        </div>
      </div>

      <article v-else-if="chapter" class="animate-fade-in">
        <h1
          :class="[
            'text-center font-cute mb-10 pb-6 border-b',
            theme === 'night' ? 'border-gray-700' : 'border-gray-200'
          ]"
          :style="{ fontSize: `${fontSize + 8}px` }"
        >
          {{ chapter.title }}
        </h1>

        <div
          class="reader-content"
          :class="[fontFamily === 'serif' ? 'font-read' : 'font-sans', themeTextClass]"
          :style="{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight
          }"
        >
          <p v-for="(para, idx) in contentParagraphs" :key="idx">{{ para }}</p>
        </div>

        <div
          :class="[
            'mt-16 pt-8 flex items-center justify-between gap-4 border-t',
            theme === 'night' ? 'border-gray-700' : 'border-gray-200'
          ]"
        >
          <button
            @click="goPrev"
            :disabled="!chapter.prevChapter"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
              chapter.prevChapter
                ? theme === 'night'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white shadow-md hover:shadow-lg text-gray-700'
                : 'opacity-30 cursor-not-allowed bg-transparent'
            ]"
          >
            <ChevronLeft :size="20" />
            <span class="hidden sm:inline">上一章</span>
          </button>

          <button
            @click="goBack"
            :class="[
              'p-3 rounded-xl transition-all',
              theme === 'night' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white shadow-md hover:shadow-lg text-gray-700'
            ]"
          >
            <Home :size="20" />
          </button>

          <button
            @click="goNext"
            :disabled="!chapter.nextChapter"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
              chapter.nextChapter
                ? theme === 'night'
                  ? 'bg-sakura-500/20 text-sakura-300 hover:bg-sakura-500/30'
                  : 'bg-gradient-to-r from-sakura-400 to-sakura-500 text-white shadow-lg shadow-sakura-200/50 hover:shadow-xl'
                : 'opacity-30 cursor-not-allowed bg-transparent'
            ]"
          >
            <span class="hidden sm:inline">下一章</span>
            <ChevronRight :size="20" />
          </button>
        </div>

        <div class="text-center mt-8 text-sm text-gray-400">
          {{ chapter.novel.title }} · {{ chapter.novel.author }}
        </div>
      </article>
    </main>

    <transition name="fade">
      <aside
        v-if="showSettings"
        class="fixed inset-0 z-60"
        @click="showSettings = false"
      >
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div
          class="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] overflow-y-auto"
          :class="theme === 'night' ? 'bg-gray-900' : 'bg-white'"
          @click.stop
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 :class="['font-cute text-xl', themeTextClass]">阅读设置</h3>
              <button @click="showSettings = false" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X :size="20" :class="theme === 'night' ? 'text-gray-400' : 'text-gray-500'" />
              </button>
            </div>

            <div class="mb-8">
              <h4 :class="['text-sm font-medium mb-3 flex items-center gap-2', themeTextClass]">
                <Sun :size="16" />
                阅读主题
              </h4>
              <div class="grid grid-cols-4 gap-3">
                <button
                  @click="setTheme('day')"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                    theme === 'day' ? 'ring-2 ring-sakura-400' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  ]"
                >
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center">
                    <Sun :size="18" class="text-amber-500" />
                  </div>
                  <span :class="['text-xs', theme === 'night' ? 'text-gray-400' : 'text-gray-600']">日间</span>
                </button>
                <button
                  @click="setTheme('night')"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                    theme === 'night' ? 'ring-2 ring-sakura-400' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  ]"
                >
                  <div class="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <Moon :size="18" class="text-gray-400" />
                  </div>
                  <span :class="['text-xs', theme === 'night' ? 'text-gray-400' : 'text-gray-600']">夜间</span>
                </button>
                <button
                  @click="setTheme('eye')"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                    theme === 'eye' ? 'ring-2 ring-sakura-400' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  ]"
                >
                  <div class="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                    <Leaf :size="18" class="text-green-500" />
                  </div>
                  <span :class="['text-xs', theme === 'night' ? 'text-gray-400' : 'text-gray-600']">护眼</span>
                </button>
                <button
                  @click="setTheme('pink')"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                    theme === 'pink' ? 'ring-2 ring-sakura-400' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  ]"
                >
                  <div class="w-10 h-10 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
                    <Heart :size="18" class="text-pink-500" />
                  </div>
                  <span :class="['text-xs', theme === 'night' ? 'text-gray-400' : 'text-gray-600']">粉色</span>
                </button>
              </div>
            </div>

            <div class="mb-8">
              <h4 :class="['text-sm font-medium mb-3 flex items-center gap-2', themeTextClass]">
                <Type :size="16" />
                字体大小: {{ fontSize }}px
              </h4>
              <div class="flex items-center gap-4">
                <button
                  @click="adjustFontSize(-2)"
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    theme === 'night' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  ]"
                >
                  <Minus :size="18" />
                </button>
                <div class="flex-1 h-2 rounded-full" :class="theme === 'night' ? 'bg-gray-700' : 'bg-gray-200'">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-sakura-400 to-sakura-500 transition-all"
                    :style="{ width: `${((fontSize - 14) / 14) * 100}%` }"
                  />
                </div>
                <button
                  @click="adjustFontSize(2)"
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    theme === 'night' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  ]"
                >
                  <Plus :size="18" />
                </button>
              </div>
            </div>

            <div class="mb-8">
              <h4 :class="['text-sm font-medium mb-3', themeTextClass]">字体</h4>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="fontFamily = 'serif'"
                  :class="[
                    'p-3 rounded-xl text-center transition-all font-read',
                    fontFamily === 'serif'
                      ? 'bg-sakura-100 text-sakura-600 ring-2 ring-sakura-400'
                      : theme === 'night' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  宋体
                </button>
                <button
                  @click="fontFamily = 'sans'"
                  :class="[
                    'p-3 rounded-xl text-center transition-all font-sans',
                    fontFamily === 'sans'
                      ? 'bg-sakura-100 text-sakura-600 ring-2 ring-sakura-400'
                      : theme === 'night' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  黑体
                </button>
              </div>
            </div>

            <div>
              <h4 :class="['text-sm font-medium mb-3', themeTextClass]">行间距</h4>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="lh in [1.5, 2, 2.5]"
                  :key="lh"
                  @click="lineHeight = lh"
                  :class="[
                    'p-3 rounded-xl text-center transition-all text-sm',
                    lineHeight === lh
                      ? 'bg-sakura-100 text-sakura-600 ring-2 ring-sakura-400'
                      : theme === 'night' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ lh === 1.5 ? '紧凑' : lh === 2 ? '标准' : '宽松' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <transition name="fade">
      <aside
        v-if="showToc"
        class="fixed inset-0 z-60"
        @click="showToc = false"
      >
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div
          class="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] overflow-y-auto"
          :class="theme === 'night' ? 'bg-gray-900' : 'bg-white'"
          @click.stop
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 :class="['font-cute text-xl', themeTextClass]">目录</h3>
              <button @click="showToc = false" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X :size="20" :class="theme === 'night' ? 'text-gray-400' : 'text-gray-500'" />
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="volume in volumes" :key="volume.id">
                <h4 :class="['text-sm font-medium px-2 py-2 flex items-center gap-2', theme === 'night' ? 'text-sakura-300' : 'text-sakura-600']">
                  🌸 {{ volume.title }}
                </h4>
                <div class="space-y-0.5">
                  <button
                    v-for="ch in volume.chapters"
                    :key="ch.id"
                    @click="goToChapter(ch.id)"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all truncate',
                      ch.id === chapterId
                        ? theme === 'night' ? 'bg-sakura-500/20 text-sakura-300 font-medium' : 'bg-sakura-100 text-sakura-600 font-medium'
                        : theme === 'night' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-sakura-50'
                    ]"
                  >
                    {{ ch.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
