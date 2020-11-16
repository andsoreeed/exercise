import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/login',
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/Product.vue'),
        meta: { needLogin: true },
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/Coupon.vue'),
        meta: { needLogin: true },
      },
      {
        path: 'orderList',
        name: 'OrderList',
        component: () => import('@/views/OrderList.vue'),
        meta: { needLogin: true },
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'CustomerOrders',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: 'customer_order',
        name: 'CustomerOrders',
        component: () => import('@/views/CustomerOrders.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.needLogin) {
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    axios.post(api).then((response) => {
    console.log('⛑️: 登入狀態', response);
      console.log(response.data)
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next();
  }
});

export default router
