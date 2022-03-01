import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 公共路由
export const constantRoutes = [
  {
    path: '/newTx',
    component: (resolve) => require(['@/views/newTx'], resolve),
    hidden: true
  },
  {
    path: '/getTx',
    component: (resolve) => require(['@/views/getTx'], resolve),
    hidden: true
  },
  {
    path: '/withdraw',
    component: (resolve) => require(['@/views/withdraw'], resolve),
    hidden: true
  },
  {
    path: '/refund',
    component: (resolve) => require(['@/views/refund'], resolve),
    hidden: true
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
