<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../utils/api'
import type { Novel, Volume, ReadingProgress } from '@shared/types'
import {
  BookOpen, Download, User, Tag, FileText, ChevronDown, ChevronRight,
  Clock, BookMarked, ArrowLeft, Star, Play
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const novelId = route.params.id as string

const novel = ref<(Novel & { readingProgress?: ReadingProgress | null }) | null>(null)
const volumes = ref<Volume[]>([])
const loading = ref(true)
const expandedVolumes = ref<Set<string>>(new Set())
const activeFormat = ref<string | null>(null)

const totalWords = computed(() => {
  if (!novel.value) return 0
  return Math.round(novel.value.wordCount / 10000)
})

async function loadData() {
  loading.value = true
  try {
    const [novelData, volumesData] = await Promise.all([
      api.getNovel(novelId),
      api.getChapters(novelId)
    ])
    novel.value = novelData
    volumes.value = volumesData
    if (volumesData.length > 0) {
      expandedVolumes.value.add(volumesData[0].id)
    }
  } catch (e) {
    console.error('Failed to load novel:', e)
  } finally {
    loading.value = false
  }
}

function toggleVolume(volId: string) {
  if (expandedVolumes.value.has(volId)) {
    expandedVolumes.value.delete(volId)
  } else {
    expandedVolumes.value.add(volId)
  }
}

function startReading(chapterId?: string) {
  let targetChapter = chapterId
  if (!targetChapter && novel.value?.readingProgress?.chapterId) {
    targetChapter = novel.value.readingProgress.chapterId
  } else if (!targetChapter && volumes.value.length > 0 && volumes.value[0].chapters.length > 0) {
    targetChapter = volumes.value[0].chapters[0].id
  }
  if (targetChapter) {
    router.push(`/novel/${novelId}/read/${targetChapter}`)
  }
}

function downloadNovel(format: string) {
  activeFormat.value = format
  window.location.href = api.getDownloadUrl(novelId, format)
  setTimeout(() => { activeFormat.value = null }, 1000)
}

function goBack() {
  router.back()
}

onMounted(loadData)
</script>

<template>
  <div class="relative z-10 min-h-screen">
    <div class="relative h-80 md:h-96 overflow-hidden">
      <div v-if="novel" class="absolute inset-0">
        <img :src="novel.cover" class="w-full h-full object-cover blur-3xl opacity-30 scale-110" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sakura-50/50 to-white" />
      <div class="absolute inset-0 bg-gradient-to-r from-sakura-100/40 to-lavender-100/40" />

      <button
        @click="goBack"
        class="absolute top-6 left-4 md:left-8 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/90 transition-all hover:scale-110"
      >
        <ArrowLeft :size="20" />
      </button>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 relative z-20 pb-20">
      <div v-if="loading" class="animate-pulse">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-48 h-64 rounded-2xl bg-sakura-100/50 mx-auto md:mx-0"></div>
          <div class="flex-1 space-y-4">
            <div class="h-10 bg-sakura-100/50 rounded w-3/4"></div>
            <div class="h-5 bg-sakura-100/30 rounded w-1/3"></div>
            <div class="h-4 bg-sakura-100/30 rounded w-full"></div>
            <div class="h-4 bg-sakura-100/30 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else-if="novel" class="animate-fade-in">
        <div class="flex flex-col md:flex-row gap-8 mb-12">
          <div class="flex-shrink-0 mx-auto md:mx-0">
            <div class="relative">
              <div class="absolute -inset-3 bg-gradient-to-r from-sakura-300/30 to-lavender-300/30 rounded-3xl blur-lg" />
              <img
                :src="novel.cover"
                :alt="novel.title"
                class="relative w-48 md:w-56 aspect-[3/4] rounded-2xl object-cover shadow-2xl shadow-sakura-300/30"
              />
            </div>
          </div>

          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  novel.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-sakura-100 text-sakura-600'
                ]"
              >
                {{ novel.status === 'completed' ? '✨ 已完结' : '🔥 连载中' }}
              </span>
              <span class="px-3 py-1 rounded-full text-sm bg-lavender-100 text-lavender-600 font-medium">
                {{ novel.category === 'fantasy' ? '奇幻' : novel.category === 'romance' ? '恋爱' : novel.category === 'campus' ? '校园' : novel.category === 'scifi' ? '科幻' : novel.category === 'mystery' ? '悬疑' : novel.category === 'adventure' ? '冒险' : '日常' }}
              </span>
            </div>

            <h1 class="font-cute text-3xl md:text-4xl text-gray-800 mb-3">{{ novel.title }}</h1>

            <div class="flex items-center gap-4 text-gray-500 mb-4">
              <span class="flex items-center gap-1.5">
                <User :size="16" />
                {{ novel.author }}
              </span>
              <span class="flex items-center gap-1.5">
                <FileText :size="16" />
                {{ totalWords }}万字
              </span>
              <span class="flex items-center gap-1.5">
                <BookMarked :size="16" />
                {{ novel.chapterCount }}章
              </span>
            </div>

            <div class="flex flex-wrap gap-2 mb-5">
              <span v-for="tag in novel.tags" :key="tag" class="tag flex items-center gap-1">
                <Tag :size="12" />
                {{ tag }}
              </span>
            </div>

            <p class="text-gray-600 leading-relaxed mb-6">{{ novel.description }}</p>

            <div class="flex flex-wrap gap-3">
              <button @click="startReading()" class="btn-primary flex items-center gap-2">
                <Play :size="18" fill="currentColor" />
                {{ novel.readingProgress ? '继续阅读' : '开始阅读' }}
              </button>
              <button v-if="novel.readingProgress" @click="startReading(volumes[0]?.chapters[0]?.id)" class="btn-secondary flex items-center gap-2">
                <BookOpen :size="18" />
                从头阅读
              </button>
            </div>

            <div v-if="novel.readingProgress" class="mt-4 p-3 rounded-xl bg-sakura-50 border border-sakura-100">
              <div class="flex items-center gap-2 text-sm text-sakura-600">
                <Clock :size="14" />
                <span>上次读到这里，继续阅读吧~</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass rounded-2xl p-6 mb-8">
          <h3 class="font-cute text-xl text-gray-800 mb-4 flex items-center gap-2">
            <Download :size="20" class="text-sakura-500" />
            下载小说
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              @click="downloadNovel('txt')"
              :class="[
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
                activeFormat === 'txt'
                  ? 'bg-sakura-500 text-white scale-95'
                  : 'bg-white border border-sakura-200 text-gray-700 hover:border-sakura-400 hover:text-sakura-600 hover:shadow-md'
              ]"
            >
              <FileText :size="18" />
              TXT 格式
            </button>
            <button
              @click="downloadNovel('epub')"
              :class="[
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
                activeFormat === 'epub'
                  ? 'bg-sakura-500 text-white scale-95'
                  : 'bg-white border border-sakura-200 text-gray-700 hover:border-sakura-400 hover:text-sakura-600 hover:shadow-md'
              ]"
            >
              <BookOpen :size="18" />
              EPUB 格式
            </button>
            <button
              @click="downloadNovel('pdf')"
              :class="[
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
                activeFormat === 'pdf'
                  ? 'bg-sakura-500 text-white scale-95'
                  : 'bg-white border border-sakura-200 text-gray-700 hover:border-sakura-400 hover:text-sakura-600 hover:shadow-md'
              ]"
            >
              <FileText :size="18" />
              PDF 格式
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-3">💡 TXT 格式始终可用，EPUB/PDF 需管理员上传源文件</p>
        </div>

        <div class="glass rounded-2xl p-6">
          <h3 class="font-cute text-xl text-gray-800 mb-4 flex items-center gap-2">
            <BookMarked :size="20" class="text-sakura-500" />
            章节目录
            <span class="text-sm font-normal text-gray-500 ml-2">共 {{ novel.chapterCount }} 章</span>
          </h3>

          <div class="space-y-2">
            <div v-for="volume in volumes" :key="volume.id" class="rounded-xl overflow-hidden">
              <button
                @click="toggleVolume(volume.id)"
                class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-sakura-50 to-lavender-50 hover:from-sakura-100 hover:to-lavender-100 transition-colors"
              >
                <span class="font-medium text-gray-800 flex items-center gap-2">
                  <Star :size="16" class="text-sakura-400" />
                  {{ volume.title }}
                  <span class="text-sm font-normal text-gray-500">{{ volume.chapters.length }}章</span>
                </span>
                <ChevronDown
                  v-if="expandedVolumes.has(volume.id)"
                  :size="20"
                  class="text-gray-400 transition-transform"
                />
                <ChevronRight v-else :size="20" class="text-gray-400 transition-transform" />
              </button>

              <transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[2000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="expandedVolumes.has(volume.id)" class="bg-white/50">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-2">
                    <button
                      v-for="(chapter, _chapterIdx) in volume.chapters"
                      :key="chapter.id"
                      @click="startReading(chapter.id)"
                      :class="[
                        'text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150 truncate',
                        novel.readingProgress?.chapterId === chapter.id
                          ? 'bg-sakura-100 text-sakura-600 font-medium'
                          : 'hover:bg-sakura-50 text-gray-600 hover:text-sakura-500'
                      ]"
                    >
                      <span v-if="novel.readingProgress?.chapterId === chapter.id" class="mr-1">📖</span>
                      {{ chapter.title }}
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
