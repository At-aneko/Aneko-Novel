<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Home, Menu, X, Moon, Sun } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const isDark = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function applySavedTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (saved === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

function goHome() {
  router.push('/')
  mobileMenuOpen.value = false
}

function goSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  applySavedTheme()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'glass shadow-lg py-2' : 'py-4 bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-8">
          <button @click="goHome" class="flex items-center gap-2 group">
            <span class="text-3xl group-hover:animate-bounce">🌸</span>
            <span class="font-cute text-2xl bg-gradient-to-r from-sakura-500 to-lavender-500 bg-clip-text text-transparent">
              Aneko - Novel
            </span>
          </button>

          <div class="hidden md:flex items-center gap-1">
            <button
              @click="goHome"
              :class="[
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                route.path === '/'
                  ? 'bg-sakura-100 dark:bg-sakura-900/40 text-sakura-600 dark:text-sakura-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-sakura-50 dark:hover:bg-gray-800 hover:text-sakura-500'
              ]"
            >
              <Home :size="18" />
              首页
            </button>
          </div>
        </div>

        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              @keyup.enter="goSearch"
              type="text"
              placeholder="搜索小说、作者..."
              class="w-full pl-10 pr-4 py-2 rounded-full glass border-0 focus:ring-2 focus:ring-sakura-300 dark:focus:ring-sakura-600 text-sm"
            />
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-sakura-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Moon v-if="!isDark" :size="20" class="text-gray-600 dark:text-gray-400" />
            <Sun v-else :size="20" class="text-yellow-500" />
          </button>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-full hover:bg-sakura-50 dark:hover:bg-gray-800"
          >
            <Menu v-if="!mobileMenuOpen" :size="22" class="text-gray-600 dark:text-gray-400" />
            <X v-else :size="22" class="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden glass mt-2 mx-4 rounded-2xl p-4 shadow-xl">
        <div class="relative mb-3">
          <input
            v-model="searchQuery"
            @keyup.enter="goSearch"
            type="text"
            placeholder="搜索小说、作者..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-sakura-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sakura-300 dark:focus:ring-sakura-600 text-sm dark:text-gray-300"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
        </div>
        <button
          @click="goHome"
          class="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-left hover:bg-sakura-50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors"
        >
          <Home :size="18" />
          <span>首页</span>
        </button>
      </div>
    </transition>
  </nav>
</template>
