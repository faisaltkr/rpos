
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
    { path: '/', 
      component: () => import('../views/LoginComponent.vue'),
      name:'Home',
      meta:{
          requiresAuth:true
      }
    },
    { path: '/login', 
      component: () => import('../views/LoginComponent.vue'),
      name:'Login'
    },
    {
        path: "/dashboard",
        component: () => import('../views/DashboardComponent.vue'),
        meta:{
          requiresAuth:true
        }
    },
    {
      path: "/sales",
      component: () => import('../views/SalesComponent.vue'),
      meta:{
        requiresAuth:true
      }
    },
    {
      path: "/customer",
      component: () => import('../views/CustomerComponent.vue'),
      meta:{
        requiresAuth:true
      }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
      next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  });

  
export default router;