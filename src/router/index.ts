import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NovelDetail from '../views/NovelDetail.vue'
import Reader from '../views/Reader.vue'
import Search from '../views/Search.vue'
import Category from '../views/Category.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/novel/:id', name: 'novel-detail', component: NovelDetail, props: true },
    { path: '/novel/:id/read/:chapterId', name: 'reader', component: Reader, props: true },
    { path: '/search', name: 'search', component: Search },
    { path: '/category/:category', name: 'category', component: Category, props: true }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
