import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/trend',
        name: 'trend',
        component: () => import('@/views/Trend.vue')
      },
      {
        path: '/detail',
        name: 'detail',
        component: () => import('@/views/Detail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router